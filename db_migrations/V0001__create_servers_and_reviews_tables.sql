CREATE TABLE IF NOT EXISTS servers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ip VARCHAR(45) NOT NULL,
    port VARCHAR(10) NOT NULL,
    map VARCHAR(100) NOT NULL,
    players INTEGER DEFAULT 0,
    max_players INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'offline',
    rating DECIMAL(2,1) DEFAULT 0.0,
    reviews_count INTEGER DEFAULT 0,
    ping INTEGER DEFAULT 0,
    game_mode VARCHAR(50) NOT NULL,
    region VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    server_id INTEGER NOT NULL REFERENCES servers(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    author_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_servers_status ON servers(status);
CREATE INDEX IF NOT EXISTS idx_servers_game_mode ON servers(game_mode);
CREATE INDEX IF NOT EXISTS idx_servers_rating ON servers(rating DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_server_id ON reviews(server_id);

INSERT INTO servers (name, ip, port, map, players, max_players, status, rating, reviews_count, ping, game_mode, region) VALUES
('RU AWP Only Server', '185.25.118.45', '27015', 'de_dust2', 28, 32, 'online', 4.8, 342, 15, 'AWP', 'RU'),
('Competitive 128 Tick', '92.63.197.102', '27016', 'de_mirage', 32, 32, 'online', 4.9, 578, 22, 'Competitive', 'EU'),
('Deathmatch 24/7', '176.32.37.98', '27017', 'aim_map', 18, 24, 'online', 4.5, 156, 35, 'Deathmatch', 'RU'),
('Surf Paradise', '195.88.54.16', '27018', 'surf_ski_2', 12, 16, 'online', 4.7, 234, 28, 'Surf', 'EU');
