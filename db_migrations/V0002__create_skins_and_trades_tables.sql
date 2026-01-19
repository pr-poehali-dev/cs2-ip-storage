CREATE TABLE IF NOT EXISTS skins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    weapon VARCHAR(100) NOT NULL,
    rarity VARCHAR(50) NOT NULL,
    wear VARCHAR(50) NOT NULL,
    price INTEGER NOT NULL,
    image_url TEXT,
    float_value DECIMAL(8,6) NOT NULL,
    owner_name VARCHAR(100),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skin_stickers (
    id SERIAL PRIMARY KEY,
    skin_id INTEGER NOT NULL REFERENCES skins(id),
    sticker_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS trade_offers (
    id SERIAL PRIMARY KEY,
    from_user VARCHAR(100) NOT NULL,
    to_user VARCHAR(100) NOT NULL,
    offered_skin_id INTEGER NOT NULL REFERENCES skins(id),
    requested_skin_id INTEGER NOT NULL REFERENCES skins(id),
    status VARCHAR(20) DEFAULT 'pending',
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_skins_rarity ON skins(rarity);
CREATE INDEX IF NOT EXISTS idx_skins_price ON skins(price);
CREATE INDEX IF NOT EXISTS idx_skins_available ON skins(is_available);
CREATE INDEX IF NOT EXISTS idx_trade_status ON trade_offers(status);

INSERT INTO skins (name, weapon, rarity, wear, price, image_url, float_value, owner_name) VALUES
('AK-47 | Redline', 'AK-47', 'Classified', 'Field-Tested', 15420, 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqPrxN7LEmyVQ7MEpiLuSrYmnjQO3-UdsZGHyd4_Bd1RvNQ7T_FDrw-_ng5Pu75iY1zI97bhXLXXp', 0.28, 'Player1'),
('M4A4 | Asiimov', 'M4A4', 'Covert', 'Battle-Scarred', 45890, 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJQJD_9W7m5a0mvLwOq7c2D8CvpQl2LCT8I-m2gHm-hA4Zm-iI9XBdQQ-Zw2F-wK6xO3vjZXo756cyHE37yYhs2GdwUJvKO_Pow', 0.67, 'Player2'),
('AWP | Dragon Lore', 'AWP', 'Covert', 'Factory New', 1250000, 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJD_9W7m5a0mvLwOq7c2GhS7ctlmdbN_Iv9nBrs-kprYTqiIdWSJgU5YlGBqFe9k-y8hpC46Z7Nz3Bn7HQl4WGdwUKGHAB4Vw', 0.01, 'Admin'),
('Desert Eagle | Blaze', 'Desert Eagle', 'Restricted', 'Factory New', 28500, 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PDdTjlH_9mkgIWKkPvxDLfYkWNF18h0juDU-LP5gVO8v11uNW_3LdWQcQU4ZVqD_VTrxrvug8Tv7svKm3o17XIh5C3dzEeygR8aOuE61avJVRzAWPIcDKKdVQ', 0.008, 'Player3'),
('Glock-18 | Fade', 'Glock-18', 'Restricted', 'Minimal Wear', 18900, 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0Ob3djFN79fnzL-YkvbnNrfYlWlS6cJlmdb18IXwjFfh_hE-Mjr1J4SXdAM9aVqGqwLqw7vohpG-6p_KmCRluD5iuyjRlF3_10s', 0.09, 'Player4'),
('USP-S | Kill Confirmed', 'USP-S', 'Classified', 'Field-Tested', 12750, 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh-TLPr7Vn35cppd13L2R9o-i21bk-Uo-ZGD1IofDdw4_YV-D-lHvlLq8g5a7ot2XnqN9JB0j', 0.22, 'Player5');

INSERT INTO skin_stickers (skin_id, sticker_name) VALUES
(1, 'Natus Vincere'),
(3, 'Titan (Holo) Katowice 2014'),
(3, 'iBUYPOWER');
