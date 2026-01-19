import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Skin {
  id: string;
  name: string;
  weapon: string;
  rarity: string;
  wear: string;
  price: number;
  image_url: string;
  float_value: number;
  owner_name: string;
  is_available: boolean;
}

const Admin = () => {
  const [skins, setSkins] = useState<Skin[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [currentSkin, setCurrentSkin] = useState<Partial<Skin>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchSkins();
  }, []);

  const fetchSkins = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/fac2ceb6-fa03-4b04-a80b-0d59fb96034f');
      const data = await response.json();
      setSkins(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить скины',
        variant: 'destructive'
      });
    }
  };

  const handleAddSkin = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/fac2ceb6-fa03-4b04-a80b-0d59fb96034f', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentSkin)
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: 'Скин добавлен'
        });
        setAddDialogOpen(false);
        setCurrentSkin({});
        fetchSkins();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить скин',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateSkin = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/fac2ceb6-fa03-4b04-a80b-0d59fb96034f', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentSkin)
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: 'Скин обновлён'
        });
        setEditDialogOpen(false);
        setCurrentSkin({});
        fetchSkins();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить скин',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteSkin = async (id: string) => {
    if (!confirm('Удалить этот скин?')) return;

    try {
      const response = await fetch(`https://functions.poehali.dev/fac2ceb6-fa03-4b04-a80b-0d59fb96034f?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: 'Скин удалён'
        });
        fetchSkins();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить скин',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Shield" size={28} className="text-primary" />
              <h1 className="text-2xl font-bold">Админ-панель</h1>
            </div>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              На главную
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Управление скинами</h2>
          <Button onClick={() => { setCurrentSkin({}); setAddDialogOpen(true); }}>
            <Icon name="Plus" size={18} className="mr-2" />
            Добавить скин
          </Button>
        </div>

        <div className="grid gap-4">
          {skins.map((skin) => (
            <Card key={skin.id}>
              <CardContent className="p-6 flex items-center gap-4">
                <img 
                  src={skin.image_url} 
                  alt={skin.name}
                  className="w-24 h-24 object-contain bg-muted rounded-lg p-2"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{skin.name}</h3>
                  <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                    <span>{skin.weapon}</span>
                    <span>{skin.rarity}</span>
                    <span>{skin.wear}</span>
                    <span>₽{skin.price.toLocaleString()}</span>
                    <span>Float: {skin.float_value}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => { setCurrentSkin(skin); setEditDialogOpen(true); }}
                  >
                    <Icon name="Edit" size={16} />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteSkin(skin.id)}
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Добавить скин</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Название</Label>
              <Input
                value={currentSkin.name || ''}
                onChange={(e) => setCurrentSkin({ ...currentSkin, name: e.target.value })}
                placeholder="AK-47 | Redline"
              />
            </div>
            <div className="space-y-2">
              <Label>Оружие</Label>
              <Input
                value={currentSkin.weapon || ''}
                onChange={(e) => setCurrentSkin({ ...currentSkin, weapon: e.target.value })}
                placeholder="AK-47"
              />
            </div>
            <div className="space-y-2">
              <Label>Редкость</Label>
              <Select 
                value={currentSkin.rarity} 
                onValueChange={(value) => setCurrentSkin({ ...currentSkin, rarity: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите редкость" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Consumer">Consumer</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                  <SelectItem value="Mil-Spec">Mil-Spec</SelectItem>
                  <SelectItem value="Restricted">Restricted</SelectItem>
                  <SelectItem value="Classified">Classified</SelectItem>
                  <SelectItem value="Covert">Covert</SelectItem>
                  <SelectItem value="Contraband">Contraband</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Износ</Label>
              <Input
                value={currentSkin.wear || ''}
                onChange={(e) => setCurrentSkin({ ...currentSkin, wear: e.target.value })}
                placeholder="Field-Tested"
              />
            </div>
            <div className="space-y-2">
              <Label>Цена (₽)</Label>
              <Input
                type="number"
                value={currentSkin.price || ''}
                onChange={(e) => setCurrentSkin({ ...currentSkin, price: Number(e.target.value) })}
                placeholder="15000"
              />
            </div>
            <div className="space-y-2">
              <Label>Float</Label>
              <Input
                type="number"
                step="0.000001"
                value={currentSkin.float_value || ''}
                onChange={(e) => setCurrentSkin({ ...currentSkin, float_value: Number(e.target.value) })}
                placeholder="0.28"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>URL изображения</Label>
              <Input
                value={currentSkin.image_url || ''}
                onChange={(e) => setCurrentSkin({ ...currentSkin, image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>Владелец</Label>
              <Input
                value={currentSkin.owner_name || ''}
                onChange={(e) => setCurrentSkin({ ...currentSkin, owner_name: e.target.value })}
                placeholder="Admin"
              />
            </div>
          </div>
          <Button onClick={handleAddSkin} className="w-full" size="lg">
            <Icon name="Plus" size={18} className="mr-2" />
            Добавить скин
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редактировать скин</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Название</Label>
              <Input
                value={currentSkin.name || ''}
                onChange={(e) => setCurrentSkin({ ...currentSkin, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Оружие</Label>
              <Input
                value={currentSkin.weapon || ''}
                onChange={(e) => setCurrentSkin({ ...currentSkin, weapon: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Редкость</Label>
              <Select 
                value={currentSkin.rarity} 
                onValueChange={(value) => setCurrentSkin({ ...currentSkin, rarity: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Consumer">Consumer</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                  <SelectItem value="Mil-Spec">Mil-Spec</SelectItem>
                  <SelectItem value="Restricted">Restricted</SelectItem>
                  <SelectItem value="Classified">Classified</SelectItem>
                  <SelectItem value="Covert">Covert</SelectItem>
                  <SelectItem value="Contraband">Contraband</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Износ</Label>
              <Input
                value={currentSkin.wear || ''}
                onChange={(e) => setCurrentSkin({ ...currentSkin, wear: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Цена (₽)</Label>
              <Input
                type="number"
                value={currentSkin.price || ''}
                onChange={(e) => setCurrentSkin({ ...currentSkin, price: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Float</Label>
              <Input
                type="number"
                step="0.000001"
                value={currentSkin.float_value || ''}
                onChange={(e) => setCurrentSkin({ ...currentSkin, float_value: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>URL изображения</Label>
              <Input
                value={currentSkin.image_url || ''}
                onChange={(e) => setCurrentSkin({ ...currentSkin, image_url: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Владелец</Label>
              <Input
                value={currentSkin.owner_name || ''}
                onChange={(e) => setCurrentSkin({ ...currentSkin, owner_name: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handleUpdateSkin} className="w-full" size="lg">
            <Icon name="Save" size={18} className="mr-2" />
            Сохранить изменения
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
