import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // --- Honest capability assessment ---------------------------------------
    // There is currently NO legitimate, password-free API available on this
    // platform that can retrieve a player's *personal* Valorant store:
    //   1. The official Riot Games Developer API does not expose store data.
    //   2. No Valorant / Riot connector is registered on this app.
    //   3. The only known methods that return a personal store require Riot
    //      Sign-On (RSO) using the player's Riot username + password, which
    //      this app is explicitly designed NOT to request or store.
    //
    // Per the product requirements, we do not fake store data. We return a
    // structured "unavailable" response so the UI can surface exactly what is
    // missing. When a legitimate data source becomes available (e.g. an
    // official store-scoped Riot connector, or an approved password-free
    // provider with backend-held credentials), wire it in here and return the
    // shapes the frontend already consumes:
    //   dailyStore: { items: [{ id, name, weapon, price, imageUrl }], expiresAt }
    //   nightMarket: { active, offers: [{ id, name, weapon, originalPrice,
    //                  discountPrice, discountPercent, imageUrl }], expiresAt? }
    //   shopReset: ISO string
    return Response.json({
      status: 'unavailable',
      reason: 'no_password_free_store_api',
      message:
        'Personal Valorant store retrieval is not available. There is no legitimate, password-free API on this platform that can fetch your personal store: the official Riot Games API does not expose store data, and no Valorant connector is registered. Retrieving a personal store requires Riot Sign-On authentication with your Riot password, which this app will never request or store.',
      dailyStore: null,
      nightMarket: null,
      shopReset: null,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}