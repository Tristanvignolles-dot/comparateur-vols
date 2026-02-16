// api/search.js — Vercel Serverless Function
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' })

  const { originCode, destinations, departureDate, returnDate, adults, children, infants, searchMode, year, month, tripDays } = req.body

  try {
    // ── Token Amadeus ────────────────────────────────────────────────────────
    const tokenRes = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.AMADEUS_API_KEY,
        client_secret: process.env.AMADEUS_API_SECRET,
      }),
    })
    if (!tokenRes.ok) {
      const err = await tokenRes.text()
      return res.status(502).json({ error: "Impossible d'obtenir le token Amadeus", detail: err })
    }
    const { access_token } = await tokenRes.json()

    const batch = (destinations || []).slice(0, 6)
    const allOffers = []
    const errors = []

    // ── MODE : Meilleur prix du mois (inspirational search) ─────────────────
    if (searchMode === 'month' && year && month) {
      await Promise.allSettled(batch.map(async (destCode) => {
        try {
          // On teste plusieurs dates dans le mois pour trouver le meilleur prix
          const datesInMonth = getSampleDates(year, month, tripDays || 7)
          let bestOffer = null
          let bestPrice = Infinity

          for (const { dep, ret } of datesInMonth) {
            try {
              const params = new URLSearchParams({
                originLocationCode: originCode,
                destinationLocationCode: destCode,
                departureDate: dep,
                returnDate: ret,
                adults: String(adults || 1),
                ...(children > 0 && { children: String(children) }),
                ...(infants > 0 && { infants: String(infants) }),
                currencyCode: 'EUR',
                max: '1',
                nonStop: 'false',
              })
              const r = await fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?${params}`, {
                headers: { Authorization: `Bearer ${access_token}` }
              })
              if (r.ok) {
                const d = await r.json()
                if (d.data?.[0]) {
                  const price = parseFloat(d.data[0].price.grandTotal)
                  if (price < bestPrice) {
                    bestPrice = price
                    bestOffer = { ...d.data[0], _destination: destCode, _dictionaries: d.dictionaries, _depDate: dep, _retDate: ret }
                  }
                }
              }
            } catch (e) { /* skip this date */ }
          }
          if (bestOffer) allOffers.push(bestOffer)
        } catch (e) { errors.push({ dest: destCode, error: e.message }) }
      }))
    } else {
      // ── MODE : Dates précises ────────────────────────────────────────────
      await Promise.allSettled(batch.map(async (destCode) => {
        try {
          const params = new URLSearchParams({
            originLocationCode: originCode,
            destinationLocationCode: destCode,
            departureDate,
            returnDate,
            adults: String(adults || 1),
            ...(children > 0 && { children: String(children) }),
            ...(infants > 0 && { infants: String(infants) }),
            currencyCode: 'EUR',
            max: '3',
            nonStop: 'false',
          })
          const r = await fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?${params}`, {
            headers: { Authorization: `Bearer ${access_token}` }
          })
          if (r.ok) {
            const d = await r.json()
            if (d.data?.length > 0) {
              allOffers.push(...d.data.map(o => ({ ...o, _destination: destCode, _dictionaries: d.dictionaries, _depDate: departureDate, _retDate: returnDate })))
            }
          } else {
            errors.push({ dest: destCode, error: await r.text() })
          }
        } catch (e) { errors.push({ dest: destCode, error: e.message }) }
      }))
    }

    // ── Tri par prix ─────────────────────────────────────────────────────────
    allOffers.sort((a, b) => parseFloat(a.price.grandTotal) - parseFloat(b.price.grandTotal))

    const nPax = (adults || 1) + (children || 0)
    const flights = allOffers.slice(0, 15).map((offer, idx) => {
      const seg = offer.itineraries?.[0]?.segments?.[0] || {}
      const retSeg = offer.itineraries?.[1]?.segments?.[0] || {}
      const carriers = offer._dictionaries?.carriers || {}
      const airlineName = carriers[seg.carrierCode] || seg.carrierCode || 'N/A'
      const stops = (offer.itineraries?.[0]?.segments?.length || 1) - 1
      const dur = offer.itineraries?.[0]?.duration || 'PT0H'
      const durMatch = dur.match(/PT(\d+H)?(\d+M)?/)
      const hours = durMatch?.[1] ? durMatch[1].replace('H', 'h') : ''
      const mins = durMatch?.[2] ? durMatch[2].replace('M', '') : ''
      const price = parseFloat(offer.price.grandTotal)
      const depDate = offer._depDate || departureDate
      const retDate = offer._retDate || returnDate
      const nights = depDate && retDate ? Math.round((new Date(retDate) - new Date(depDate)) / 86400000) : (tripDays || '?')

      return {
        id: idx + 1,
        destination: offer._destination,
        destinationIcon: getDestIcon(offer._destination),
        airline: airlineName,
        price: Math.round(price),
        totalPrice: Math.round(price * nPax),
        duration: `${hours}${mins ? mins + 'min' : ''}`,
        stops: stops === 0 ? 'Direct' : `${stops} escale${stops > 1 ? 's' : ''}`,
        dates: `${formatDate(depDate)} → ${formatDate(retDate)}`,
        rawDep: depDate,
        rawRet: retDate,
        nights,
        departureAirport: originCode,
        badge: idx === 0 ? '🔥 MEILLEUR PRIX' : idx < 3 ? '⚡ BON PLAN' : null,
        details: [
          { label: 'Vol aller', value: `${seg.carrierCode}${seg.number} · ${seg.departure?.at?.slice(11,16) || '?'} → ${seg.arrival?.at?.slice(11,16) || '?'}` },
          { label: 'Vol retour', value: retSeg.carrierCode ? `${retSeg.carrierCode}${retSeg.number} · départ ${retSeg.departure?.at?.slice(11,16) || '?'}` : 'voir billet' },
          { label: 'Escales', value: stops === 0 ? 'Direct' : `${stops} escale(s)` },
          { label: 'Durée vol', value: `${hours}${mins ? mins + 'min' : ''}` },
          { label: 'Nuits sur place', value: `${nights} nuits` },
          { label: 'Classe', value: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'ECONOMY' },
          { label: 'Bagages', value: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags?.quantity > 0 ? 'Inclus' : 'Cabine uniquement' },
          { label: 'Compagnie', value: airlineName },
        ],
        aiAnalysis: `Prix réel Amadeus. Vol ${stops === 0 ? 'direct' : 'avec escale'} opéré par ${airlineName}. ${nights} nuits sur place. Durée vol : ${hours}${mins ? mins + 'min' : ''}.`,
        isRealData: true,
      }
    })

    return res.status(200).json({
      summary: `${flights.length} offre${flights.length > 1 ? 's' : ''} trouvée${flights.length > 1 ? 's' : ''} au départ de ${originCode}${searchMode === 'month' ? ` — meilleurs prix de ${MONTH_NAMES[month - 1]} ${year}` : ''}, triées par prix croissant.`,
      priceRange: { min: flights[0]?.price || 0, max: flights[flights.length - 1]?.price || 0 },
      flights,
      errors: errors.length > 0 ? errors : undefined,
      isRealData: true,
    })

  } catch (err) {
    return res.status(500).json({ error: 'Erreur serveur', detail: err.message })
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────
