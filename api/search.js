// api/search.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' })
  }
  const { originCode, destinations, departureDate, returnDate, adults, children, infants } = req.body
  try {
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
    const allOffers = []
    const errors = []
    const batch = (destinations || ['LON','AMS','FCO','DXB','BKK','JFK']).slice(0, 6)
    await Promise.allSettled(batch.map(async (destCode) => {
      try {
        const params = new URLSearchParams({
          originLocationCode: originCode,
          destinationLocationCode: destCode,
          departureDate, returnDate,
          adults: String(adults || 1),
          ...(children > 0 && { children: String(children) }),
          ...(infants > 0 && { infants: String(infants) }),
          currencyCode: 'EUR', max: '3', nonStop: 'false',
        })
        const searchRes = await fetch(
          `https://test.api.amadeus.com/v2/shopping/flight-offers?${params}`,
          { headers: { Authorization: `Bearer ${access_token}` } }
        )
        if (searchRes.ok) {
          const data = await searchRes.json()
          if (data.data?.length > 0) {
            allOffers.push(...data.data.map(o => ({ ...o, _destination: destCode, _dictionaries: data.dictionaries })))
          }
        } else {
          errors.push({ dest: destCode, error: await searchRes.text() })
        }
      } catch (e) { errors.push({ dest: destCode, error: e.message }) }
    }))
    allOffers.sort((a, b) => parseFloat(a.price.grandTotal) - parseFloat(b.price.grandTotal))
    const flights = allOffers.slice(0, 12).map((offer, idx) => {
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
      return {
        id: idx + 1,
        destination: offer._destination,
        country: offer._destination,
        destinationIcon: getDestIcon(offer._destination),
        airline: airlineName,
        price: Math.round(price),
        totalPrice: Math.round(price * ((adults || 1) + (children || 0))),
        duration: `${hours}${mins ? mins + 'min' : ''}`,
        stops: stops === 0 ? 'Direct' : `${stops} escale${stops > 1 ? 's' : ''}`,
        dates: `${departureDate} → ${returnDate}`,
        departureAirport: originCode,
        badge: idx === 0 ? '🔥 MEILLEURE OFFRE' : idx < 3 ? '⚡ PROMO FLASH' : null,
        details: [
          { label: 'Vol aller', value: `${seg.carrierCode}${seg.number} · ${seg.departure?.at?.slice(11,16)} → ${seg.arrival?.at?.slice(11,16)}` },
          { label: 'Retour', value: retSeg.departure?.at?.slice(11,16) ? `départ ${retSeg.departure.at.slice(11,16)}` : 'voir billet' },
          { label: 'Escales', value: stops === 0 ? 'Direct' : `${stops} escale(s)` },
          { label: 'Classe', value: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'ECONOMY' },
          { label: 'Bagages', value: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags?.quantity > 0 ? 'Inclus' : 'Cabine uniquement' },
          { label: 'Compagnie', value: airlineName },
        ],
        aiAnalysis: `Prix réel Amadeus. Vol ${stops === 0 ? 'direct' : 'avec escale'} par ${airlineName}. Durée : ${hours}${mins ? mins + 'min' : ''}.`,
        isRealData: true,
      }
    })
    return res.status(200).json({
      summary: `${flights.length} offres trouvées au départ de ${originCode}, triées par prix croissant.`,
      priceRange: { min: flights[0]?.price || 0, max: flights[flights.length - 1]?.price || 0 },
      flights,
      errors: errors.length > 0 ? errors : undefined,
      isRealData: true,
    })
  } catch (err) {
    return res.status(500).json({ error: 'Erreur serveur', detail: err.message })
  }
}
function getDestIcon(code) {
  const map = { LON:'🎡',LHR:'🎡',CDG:'🗼',ORY:'🗼',BCN:'🎭',AMS:'🌷',FCO:'🏛️',DXB:'🏙️',DOH:'🕌',BKK:'🏯',SIN:'🦁',JFK:'🗽',MIA:'🌊',CUN:'🌴',CMN:'🕌',RAK:'🌅',MRU:'🐠',RUN:'🌋',SEZ:'🏝️',NRT:'⛩️',ATH:'🏛️',IST:'🌙',LIS:'🐟',CPH:'🧜',VIE:'🎼',MAD:'💃' }
  return map[code] || '✈️'
}
