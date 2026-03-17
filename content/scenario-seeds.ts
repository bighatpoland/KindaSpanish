export const scenarioSeeds = [
  {
    id: "courier-dropoff",
    domain: "courier",
    intent: "Confirm a package handoff",
    difficulty: "starter",
    estimatedMinutes: 2,
    quickStartPrompt: "The courier is at your door. Answer fast and keep it simple.",
    transcript: [
      "Hola, traigo un paquete para ti.",
      "Si, un momento. Puedes dejarlo aqui, por favor?"
    ],
    targetChunks: [
      "un momento",
      "puedes dejarlo aqui",
      "gracias, ya bajo"
    ],
    mission: "Use one package-related phrase today if a delivery or pickup moment happens.",
    audioClips: [
      {
        id: "courier-dropoff-neutral",
        variant: "neutral",
        transcript: "Hola, traigo un paquete para ti.",
        playbackRate: 0.94,
        ttsFallback: true
      },
      {
        id: "courier-dropoff-fast",
        variant: "fast",
        transcript: "Hola, traigo un paquete para ti.",
        playbackRate: 1.12,
        ttsFallback: true
      }
    ]
  },
  {
    id: "corner-shop",
    domain: "shop",
    intent: "Ask for one thing and understand the answer",
    difficulty: "starter",
    estimatedMinutes: 2,
    quickStartPrompt: "You are in a small shop and need one item quickly.",
    transcript: [
      "Perdona, tienes bolsas de basura?",
      "Si, al fondo a la derecha."
    ],
    targetChunks: [
      "perdona",
      "tienes",
      "al fondo a la derecha"
    ],
    mission: "Ask for one item in Spanish the next time you are in a shop.",
    audioClips: [
      {
        id: "corner-shop-neutral",
        variant: "neutral",
        transcript: "Perdona, tienes bolsas de basura?",
        playbackRate: 0.94,
        ttsFallback: true
      },
      {
        id: "corner-shop-messy",
        variant: "fast",
        transcript: "Perdona, tienes bolsas de basura?",
        playbackRate: 1.1,
        ttsFallback: true
      }
    ]
  },
  {
    id: "neighbor-small-talk",
    domain: "neighbor",
    intent: "Do tiny talk without freezing",
    difficulty: "starter",
    estimatedMinutes: 2,
    quickStartPrompt: "Your neighbor smiles and starts a short conversation.",
    transcript: [
      "Que tal? Todo bien con los perros?",
      "Si, todo bien. Hoy estan con mucha energia."
    ],
    targetChunks: [
      "que tal",
      "todo bien",
      "con mucha energia"
    ],
    mission: "Say one friendly sentence to a neighbor or passerby this week.",
    audioClips: [
      {
        id: "neighbor-small-talk-neutral",
        variant: "neutral",
        transcript: "Que tal? Todo bien con los perros?",
        playbackRate: 0.92,
        ttsFallback: true
      },
      {
        id: "neighbor-small-talk-andalusian-light",
        variant: "fast",
        transcript: "Que tal? Todo bien con los perros?",
        playbackRate: 1.08,
        ttsFallback: true
      }
    ]
  }
] as const;
