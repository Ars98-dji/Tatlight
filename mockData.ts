
import { Product, User } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Creative Spark: Débloquez votre potentiel',
    category: 'Développement personnel',
    type: 'ebook',
    price: 29.99,
    description: 'Ce guide complet est conçu pour vous aider à surmonter les blocages créatifs.',
    image: 'https://picsum.photos/seed/creative/600/800',
    rating: 4.8,
    sales: 150
  },
  {
    id: 'p2',
    name: "Beat Lofi 'Nuit Étoilée'",
    category: 'Musique',
    type: 'instrumental',
    price: 49.99,
    description: 'Une instrumentale apaisante pour vos sessions de travail ou de relaxation.',
    image: 'https://picsum.photos/seed/lofi/600/800',
    rating: 4.9,
    sales: 85
  },
  {
    id: 'p3',
    name: 'Kit de Templates Instagram Mystic',
    category: 'Design',
    type: 'template',
    price: 35.00,
    description: 'Collection envoûtante de templates Canva pour votre identité visuelle.',
    image: 'https://picsum.photos/seed/mystic/600/800',
    rating: 4.7,
    sales: 220
  },
  {
    id: 'p4',
    name: 'Formation Web Design Pro',
    category: 'Business',
    type: 'formation',
    price: 149.99,
    description: 'Apprenez les bases et les techniques avancées du design web moderne.',
    image: 'https://picsum.photos/seed/design/600/800',
    rating: 4.5,
    sales: 45
  },
  {
    id: 'p5',
    name: "L'Art de l'Écriture",
    category: 'Développement personnel',
    type: 'ebook',
    price: 19.99,
    description: 'Maîtrisez les subtilités de la plume et captivez votre lectorat.',
    image: 'https://picsum.photos/seed/writing/600/800',
    rating: 4.6,
    sales: 110
  },
  {
    id: 'p6',
    name: 'Pack de Sons Ambiants',
    category: 'Musique',
    type: 'instrumental',
    price: 59.99,
    description: 'Atmosphères sonores immersives pour créateurs de contenu.',
    image: 'https://picsum.photos/seed/ambient/600/800',
    rating: 4.8,
    sales: 70
  }
];

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Jean Dupont',
  email: 'jean@tatlight.com',
  role: 'user',
  avatar: 'https://picsum.photos/seed/avatar/200/200',
  credits: 250
};

export const MOCK_ADMIN: User = {
  id: 'u2',
  name: 'Admin Tatlight',
  email: 'admin@tatlight.com',
  role: 'admin',
  avatar: 'https://picsum.photos/seed/admin/200/200',
  credits: 0
};
