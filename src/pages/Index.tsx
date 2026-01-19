import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Server {
  id: string;
  name: string;
  ip: string;
  port: string;
  map: string;
  players: number;
  maxPlayers: number;
  status: 'online' | 'offline';
  rating: number;
  reviews: number;
  ping: number;
  gameMode: string;
  region: string;
}

interface Skin {
  id: string;
  name: string;
  weapon: string;
  rarity: 'Consumer' | 'Industrial' | 'Mil-Spec' | 'Restricted' | 'Classified' | 'Covert' | 'Contraband';
  wear: string;
  price: number;
  image: string;
  float: number;
  stickers?: string[];
}

const mockServers: Server[] = [
  {
    id: '1',
    name: 'RU AWP Only Server',
    ip: '185.25.118.45',
    port: '27015',
    map: 'de_dust2',
    players: 28,
    maxPlayers: 32,
    status: 'online',
    rating: 4.8,
    reviews: 342,
    ping: 15,
    gameMode: 'AWP',
    region: 'RU'
  },
  {
    id: '2',
    name: 'Competitive 128 Tick',
    ip: '92.63.197.102',
    port: '27016',
    map: 'de_mirage',
    players: 32,
    maxPlayers: 32,
    status: 'online',
    rating: 4.9,
    reviews: 578,
    ping: 22,
    gameMode: 'Competitive',
    region: 'EU'
  },
  {
    id: '3',
    name: 'Deathmatch 24/7',
    ip: '176.32.37.98',
    port: '27017',
    map: 'aim_map',
    players: 18,
    maxPlayers: 24,
    status: 'online',
    rating: 4.5,
    reviews: 156,
    ping: 35,
    gameMode: 'Deathmatch',
    region: 'RU'
  },
  {
    id: '4',
    name: 'Surf Paradise',
    ip: '195.88.54.16',
    port: '27018',
    map: 'surf_ski_2',
    players: 12,
    maxPlayers: 16,
    status: 'online',
    rating: 4.7,
    reviews: 234,
    ping: 28,
    gameMode: 'Surf',
    region: 'EU'
  }
];

const mockSkins: Skin[] = [
  {
    id: '1',
    name: 'AK-47 | Redline',
    weapon: 'AK-47',
    rarity: 'Classified',
    wear: 'Field-Tested',
    price: 15420,
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqPrxN7LEmyVQ7MEpiLuSrYmnjQO3-UdsZGHyd4_Bd1RvNQ7T_FDrw-_ng5Pu75iY1zI97bhXLXXp',
    float: 0.28,
    stickers: ['Natus Vincere']
  },
  {
    id: '2',
    name: 'M4A4 | Asiimov',
    weapon: 'M4A4',
    rarity: 'Covert',
    wear: 'Battle-Scarred',
    price: 45890,
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJQJD_9W7m5a0mvLwOq7c2D8CvpQl2LCT8I-m2gHm-hA4Zm-iI9XBdQQ-Zw2F-wK6xO3vjZXo756cyHE37yYhs2GdwUJvKO_Pow',
    float: 0.67
  },
  {
    id: '3',
    name: 'AWP | Dragon Lore',
    weapon: 'AWP',
    rarity: 'Covert',
    wear: 'Factory New',
    price: 1250000,
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJD_9W7m5a0mvLwOq7c2GhS7ctlmdbN_Iv9nBrs-kprYTqiIdWSJgU5YlGBqFe9k-y8hpC46Z7Nz3Bn7HQl4WGdwUKGHAB4Vw',
    float: 0.01,
    stickers: ['Titan (Holo) Katowice 2014', 'iBUYPOWER']
  },
  {
    id: '4',
    name: 'Desert Eagle | Blaze',
    weapon: 'Desert Eagle',
    rarity: 'Restricted',
    wear: 'Factory New',
    price: 28500,
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PDdTjlH_9mkgIWKkPvxDLfYkWNF18h0juDU-LP5gVO8v11uNW_3LdWQcQU4ZVqD_VTrxrvug8Tv7svKm3o17XIh5C3dzEeygR8aOuE61avJVRzAWPIcDKKdVQ',
    float: 0.008
  },
  {
    id: '5',
    name: 'Glock-18 | Fade',
    weapon: 'Glock-18',
    rarity: 'Restricted',
    wear: 'Minimal Wear',
    price: 18900,
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0Ob3djFN79fnzL-YkvbnNrfYlWlS6cJlmdb18IXwjFfh_hE-Mjr1J4SXdAM9aVqGqwLqw7vohpG-6p_KmCRluD5iuyjRlF3_10s',
    float: 0.09
  },
  {
    id: '6',
    name: 'USP-S | Kill Confirmed',
    weapon: 'USP-S',
    rarity: 'Classified',
    wear: 'Field-Tested',
    price: 12750,
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh-TLPr7Vn35cppd13L2R9o-i21bk-Uo-ZGD1IofDdw4_YV-D-lHvlLq8g5a7ot2XnqN9JB0j',
    float: 0.22
  }
];

const Index = () => {
  const [servers] = useState<Server[]>(mockServers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [skins] = useState<Skin[]>(mockSkins);
  const [skinSearch, setSkinSearch] = useState('');
  const [selectedSkin, setSelectedSkin] = useState<Skin | null>(null);

  const filteredServers = servers.filter(server => {
    const matchesSearch = 
      server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.ip.includes(searchQuery) ||
      server.map.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || server.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Icon name="Gamepad2" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">CS2 Servers</h1>
                <p className="text-sm text-muted-foreground">Лучшие серверы Counter-Strike 2</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#servers" className="text-foreground hover:text-primary transition-colors">Серверы</a>
              <a href="#top" className="text-foreground hover:text-primary transition-colors">Топ рейтинг</a>
              <a href="#skins" className="text-foreground hover:text-primary transition-colors">Скины</a>
              <a href="#contacts" className="text-foreground hover:text-primary transition-colors">Контакты</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-12">
        <section className="text-center space-y-6 py-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <Icon name="Radio" size={16} />
            <span>{servers.filter(s => s.status === 'online').length} серверов онлайн</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Найди свой идеальный сервер
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Лучшие серверы CS2 с высоким рейтингом и стабильным пингом
          </p>
        </section>

        <section id="servers" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск по названию, IP, карте..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Статус сервера" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все серверы</SelectItem>
                <SelectItem value="online">Онлайн</SelectItem>
                <SelectItem value="offline">Оффлайн</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Все</TabsTrigger>
              <TabsTrigger value="competitive">Competitive</TabsTrigger>
              <TabsTrigger value="awp">AWP</TabsTrigger>
              <TabsTrigger value="dm">Deathmatch</TabsTrigger>
              <TabsTrigger value="surf">Surf</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredServers.map((server, index) => (
                  <Card 
                    key={server.id} 
                    className="hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 cursor-pointer animate-scale-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => setSelectedServer(server)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{server.name}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Icon name="MapPin" size={14} />
                            <span>{server.map}</span>
                          </div>
                        </div>
                        <Badge variant={server.status === 'online' ? 'default' : 'secondary'}>
                          {server.status === 'online' ? 'Online' : 'Offline'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Icon name="Users" size={16} className="text-primary" />
                          <span>{server.players}/{server.maxPlayers}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="Activity" size={16} className="text-secondary" />
                          <span>{server.ping}ms</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Icon
                              key={i}
                              name="Star"
                              size={14}
                              className={i < Math.floor(server.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-muted'}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {server.rating} ({server.reviews} отзывов)
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <code className="flex-1 bg-muted px-3 py-2 rounded text-sm font-mono">
                          {server.ip}:{server.port}
                        </code>
                        <Button size="sm" variant="ghost">
                          <Icon name="Copy" size={16} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <section id="top" className="space-y-6">
          <div className="flex items-center gap-3">
            <Icon name="Trophy" size={28} className="text-primary" />
            <h3 className="text-3xl font-bold">Топ серверов</h3>
          </div>
          <div className="grid gap-4">
            {servers
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 3)
              .map((server, index) => (
                <Card key={server.id} className="hover:border-primary transition-all">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary text-2xl font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{server.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Icon name="Users" size={14} />
                          {server.players}/{server.maxPlayers}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="Star" size={14} className="text-yellow-500" />
                          {server.rating}
                        </span>
                        <span>{server.gameMode}</span>
                      </div>
                    </div>
                    <Button variant="outline">
                      Подключиться
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </section>

        <section id="skins" className="space-y-6 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Shirt" size={28} className="text-primary" />
              <h3 className="text-3xl font-bold">Обмен скинов</h3>
            </div>
            <Badge variant="outline" className="text-sm">
              {skins.length} предметов
            </Badge>
          </div>

          <div className="relative">
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск по названию оружия..."
              value={skinSearch}
              onChange={(e) => setSkinSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {skins
              .filter(skin => 
                skin.name.toLowerCase().includes(skinSearch.toLowerCase()) ||
                skin.weapon.toLowerCase().includes(skinSearch.toLowerCase())
              )
              .map((skin, index) => {
                const rarityColors = {
                  'Consumer': 'bg-gray-500',
                  'Industrial': 'bg-blue-500',
                  'Mil-Spec': 'bg-blue-600',
                  'Restricted': 'bg-purple-500',
                  'Classified': 'bg-pink-500',
                  'Covert': 'bg-red-500',
                  'Contraband': 'bg-yellow-500'
                };

                return (
                  <Card 
                    key={skin.id}
                    className="hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 cursor-pointer overflow-hidden animate-scale-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => setSelectedSkin(skin)}
                  >
                    <div className={`h-2 ${rarityColors[skin.rarity]}`} />
                    <CardHeader>
                      <div className="aspect-video bg-gradient-to-br from-muted to-card flex items-center justify-center rounded-lg overflow-hidden">
                        <img 
                          src={skin.image} 
                          alt={skin.name}
                          className="w-full h-full object-contain p-4"
                        />
                      </div>
                      <CardTitle className="text-lg mt-4">{skin.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{skin.wear}</span>
                        <Badge variant="secondary">{skin.rarity}</Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Float: {skin.float.toFixed(4)}
                        </div>
                        <div className="text-xl font-bold text-primary">
                          ₽{skin.price.toLocaleString()}
                        </div>
                      </div>

                      {skin.stickers && skin.stickers.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Icon name="Sticker" size={12} />
                          <span>{skin.stickers.length} стикеров</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </section>

        <section id="contacts" className="space-y-6 py-12">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-bold">Контакты</h3>
            <p className="text-muted-foreground">Свяжитесь с нами по любым вопросам</p>
          </div>
          <div className="max-w-md mx-auto space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Icon name="Mail" size={20} className="text-primary" />
                  <span>admin@cs2servers.ru</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="MessageCircle" size={20} className="text-primary" />
                  <span>Telegram: @cs2admin</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Globe" size={20} className="text-primary" />
                  <span>Discord: CS2Servers</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Dialog open={!!selectedSkin} onOpenChange={() => setSelectedSkin(null)}>
        <DialogContent className="max-w-2xl">
          {selectedSkin && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedSkin.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="aspect-video bg-gradient-to-br from-muted to-card flex items-center justify-center rounded-lg overflow-hidden">
                  <img 
                    src={selectedSkin.image} 
                    alt={selectedSkin.name}
                    className="w-full h-full object-contain p-8"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Оружие</Label>
                    <p className="bg-muted px-3 py-2 rounded font-semibold">{selectedSkin.weapon}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Качество</Label>
                    <p className="bg-muted px-3 py-2 rounded">{selectedSkin.wear}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Редкость</Label>
                    <Badge variant="secondary" className="w-full justify-center py-2">{selectedSkin.rarity}</Badge>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Float</Label>
                    <p className="bg-muted px-3 py-2 rounded font-mono">{selectedSkin.float.toFixed(6)}</p>
                  </div>
                </div>

                {selectedSkin.stickers && selectedSkin.stickers.length > 0 && (
                  <div className="space-y-2">
                    <Label>Стикеры</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedSkin.stickers.map((sticker, i) => (
                        <Badge key={i} variant="outline">{sticker}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Цена</p>
                    <p className="text-3xl font-bold text-primary">₽{selectedSkin.price.toLocaleString()}</p>
                  </div>
                  <Button size="lg" className="gap-2">
                    <Icon name="ShoppingCart" size={20} />
                    Купить скин
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedServer} onOpenChange={() => setSelectedServer(null)}>
        <DialogContent className="max-w-2xl">
          {selectedServer && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedServer.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">IP адрес</Label>
                    <code className="block bg-muted px-3 py-2 rounded font-mono">
                      {selectedServer.ip}:{selectedServer.port}
                    </code>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Карта</Label>
                    <p className="bg-muted px-3 py-2 rounded">{selectedServer.map}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Игроки</Label>
                    <p className="bg-muted px-3 py-2 rounded">{selectedServer.players}/{selectedServer.maxPlayers}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Пинг</Label>
                    <p className="bg-muted px-3 py-2 rounded">{selectedServer.ping}ms</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Режим</Label>
                    <p className="bg-muted px-3 py-2 rounded">{selectedServer.gameMode}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Регион</Label>
                    <p className="bg-muted px-3 py-2 rounded">{selectedServer.region}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Отзывы игроков</Label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Icon
                          key={i}
                          name="Star"
                          size={20}
                          className={i < Math.floor(selectedServer.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-muted'}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-semibold">{selectedServer.rating}</span>
                    <span className="text-muted-foreground">({selectedServer.reviews} отзывов)</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Оставить отзыв</Label>
                  <Textarea placeholder="Напишите ваш отзыв о сервере..." rows={4} />
                  <Button className="w-full">
                    <Icon name="Send" size={16} className="mr-2" />
                    Отправить отзыв
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <footer className="border-t border-border mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2026 CS2 Servers. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;