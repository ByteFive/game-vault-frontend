import type { FictionalUser } from '@/types/User'

const avatar = (seed: string) =>
  `https://placehold.co/200x200/1B1824/C4A9FF?text=${encodeURIComponent(seed)}&font=raleway`

export const mockUsers: FictionalUser[] = [
  {
    id: 'joao',
    nome: 'João',
    avatar: avatar('J'),
    bio: 'Fã de mundo aberto e souls-likes. Sempre em busca do próximo desafio brutal.',
  },
  {
    id: 'marina',
    nome: 'Marina',
    avatar: avatar('M'),
    bio: 'RPGs narrativos e jogos cooperativos são minha praia. Odeio perder tempo com grind.',
  },
  {
    id: 'lucas',
    nome: 'Lucas',
    avatar: avatar('L'),
    bio: 'Competitivo até no café da manhã. Jogo tudo que tenha ranking.',
  },
]
