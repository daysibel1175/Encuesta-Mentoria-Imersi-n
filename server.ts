import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

export interface PollOption {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  accentClass: string;
}

export interface VoteRecord {
  id: string;
  optionId: string;
  optionTitle: string;
  studentName: string;
  timestamp: number;
}

const POLL_OPTIONS: PollOption[] = [
  {
    id: 'aula-1',
    title: 'Clase 1 (Google Opal)',
    subtitle: 'Interacciones iniciales y flujos con Google Opal',
    color: '#2563EB', // Blue
    accentClass: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'aula-2',
    title: 'Clase 2 (ChatGPT Work)',
    subtitle: 'Estructuración de prompts y flujos de trabajo en ChatGPT',
    color: '#059669', // Emerald
    accentClass: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'aula-3',
    title: 'Clase 3 (Make.com)',
    subtitle: 'Conexión de módulos, lógica de datos y automatización',
    color: '#7C3AED', // Violet / Purple
    accentClass: 'from-purple-500 to-violet-600',
  },
  {
    id: 'aula-all-ok',
    title: 'Concluí las 3 sin problemas',
    subtitle: 'Completé todas las lecciones y prácticas sin trabas',
    color: '#D97706', // Amber / Gold
    accentClass: 'from-amber-500 to-orange-600',
  },
];

const DATA_FILE = path.join(__dirname, '.poll_votes.json');

let votes: VoteRecord[] = [];
let lastResetAt: number = Date.now();

// Load persisted votes if file exists
try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.votes)) {
      votes = parsed.votes;
    }
    if (parsed.lastResetAt) {
      lastResetAt = parsed.lastResetAt;
    }
  }
} catch (err) {
  console.error('Error loading initial votes:', err);
}

function saveVotesToFile() {
  try {
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify({ votes, lastResetAt }, null, 2),
      'utf-8'
    );
  } catch (err) {
    console.error('Error saving votes to file:', err);
  }
}

function calculatePollState() {
  const totalVotes = votes.length;
  const breakdown: Record<
    string,
    { count: number; percentage: number; option: PollOption }
  > = {};

  for (const opt of POLL_OPTIONS) {
    const count = votes.filter((v) => v.optionId === opt.id).length;
    const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
    breakdown[opt.id] = { count, percentage, option: opt };
  }

  // Find dominant friction
  let topFriction: { option: PollOption; count: number; percentage: number } | null = null;
  const frictionOptions = POLL_OPTIONS.filter((o) => o.id !== 'aula-all-ok');
  let maxCount = -1;
  for (const opt of frictionOptions) {
    const data = breakdown[opt.id];
    if (data.count > maxCount && data.count > 0) {
      maxCount = data.count;
      topFriction = { option: opt, count: data.count, percentage: data.percentage };
    }
  }

  return {
    question: '¿En qué clase te trabaste más?',
    options: POLL_OPTIONS,
    totalVotes,
    breakdown,
    topFriction,
    votes: [...votes].sort((a, b) => b.timestamp - a.timestamp),
    lastResetAt,
  };
}

// API Routes
app.get('/api/poll', (_req, res) => {
  res.json(calculatePollState());
});

app.post('/api/poll/vote', (req, res) => {
  const { optionId, studentName } = req.body;
  const option = POLL_OPTIONS.find((o) => o.id === optionId);

  if (!option) {
    return res.status(400).json({ error: 'Opción de encuesta inválida.' });
  }

  const cleanName =
    typeof studentName === 'string' && studentName.trim().length > 0
      ? studentName.trim().slice(0, 50)
      : `Estudiante #${votes.length + 1}`;

  const newVote: VoteRecord = {
    id: 'v_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
    optionId: option.id,
    optionTitle: option.title,
    studentName: cleanName,
    timestamp: Date.now(),
  };

  votes.push(newVote);
  saveVotesToFile();

  res.json({
    success: true,
    voteId: newVote.id,
    poll: calculatePollState(),
  });
});

app.post('/api/poll/reset', (_req, res) => {
  votes = [];
  lastResetAt = Date.now();
  saveVotesToFile();
  res.json({
    success: true,
    message: 'Todos los votos han sido eliminados con éxito.',
    poll: calculatePollState(),
  });
});

app.post('/api/poll/seed-mock', (_req, res) => {
  const mockStudents = [
    { name: 'Lucas R.', optionId: 'aula-1' },
    { name: 'Camila Díaz', optionId: 'aula-3' },
    { name: 'Mateo González', optionId: 'aula-2' },
    { name: 'Valentina P.', optionId: 'aula-3' },
    { name: 'Sebastián M.', optionId: 'aula-all-ok' },
    { name: 'Lucía Fernández', optionId: 'aula-3' },
    { name: 'Esteban Cruz', optionId: 'aula-2' },
    { name: 'Mariana S.', optionId: 'aula-all-ok' },
    { name: 'Diego Torres', optionId: 'aula-1' },
    { name: 'Paula N.', optionId: 'aula-3' },
    { name: 'Andrés V.', optionId: 'aula-all-ok' },
    { name: 'Sofía Romero', optionId: 'aula-2' },
  ];

  const now = Date.now();
  votes = mockStudents.map((item, index) => {
    const opt = POLL_OPTIONS.find((o) => o.id === item.optionId)!;
    return {
      id: 'demo_' + index + '_' + Math.random().toString(36).substring(2, 6),
      optionId: opt.id,
      optionTitle: opt.title,
      studentName: item.name,
      timestamp: now - (mockStudents.length - index) * 45000,
    };
  });

  saveVotesToFile();
  res.json({
    success: true,
    message: 'Datos de prueba cargados correctamente.',
    poll: calculatePollState(),
  });
});

// Setup Vite or static serving
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor de encuesta listo en http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
