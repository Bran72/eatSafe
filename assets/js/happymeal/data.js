let mealsPattern = [
  {
    name: 'Petit déjeuner',
    portions: 3
  },
  {
    name: 'Déjeuner',
    portions: 5
  },
  {
    name: 'Goûter',
    portions: 2
  },
  {
    name: 'Dîner',
    portions: 5
  }
]

let recommendations = [
  {
    id: 1,
    name: 'Fruits et légumes',
    min: 5,
    period: 'day',
    cumulative: true
  },
  {
    id: 2,
    name: 'Viande rouge',
    max: 2,
    period: 'week',
    cumulative: false
  },
  {
    id: 3,
    name: 'Charcuterie',
    max: 1,
    period: 'week',
    cumulative: false
  },
  {
    id: 4,
    name: 'Viande blanche',
    max: 1,
    period: 'day',
    cumulative: false
  },
  {
    id: 5,
    name: 'Féculents et produits céréaliers',
    max: 2,
    period: 'day',
    cumulative: true
  },
  {
    id: 6,
    name: 'Poisson gras',
    max: 1,
    period: 'week',
    cumulative: false
  },
  {
    id: 7,
    name: 'Poisson maigre',
    max: 1,
    period: 'week',
    cumulative: false
  },
  {
    id: 8,
    name: 'Œuf',
    max: 1,
    period: 'day',
    cumulative: false
  },
  {
    id: 9,
    name: 'Produits laitiers',
    max: 3,
    period: 'day',
    cumulative: true
  },
  {
    id: 10,
    name: 'Légumineuses',
    min: 2,
    period: 'week',
    cumulative: true
  }
]

let weekUptake = {
  monday: {
    0: [
      {id: 1, name: 'Fruits et légumes',  portions: 1},
      {id: 9, name: 'Produits laitiers',  portions: 1},
      {id: 5, name: 'Féculents et produits céréaliers',  portions: 1}
    ],
    2: [
      {id: 9, name: 'Produits laitiers',  portions: 1},
      {id: 1, name: 'Fruits et légumes',  portions: 1}
    ],
    3: [
      {id: 9, name: 'Produits laitiers',  portions: 1},
      {id: 1, name: 'Fruits et légumes',  portions: 1},
      {id: 5, name: 'Féculents et produits céréaliers',  portions: 3}
    ]
  },
  tuesday: {
    0: [
      {id: 1, name: 'Fruits et légumes',  portions: 1},
      {id: 9, name: 'Produits laitiers',  portions: 1},
      {id: 5, name: 'Féculents et produits céréaliers',  portions: 1}
    ],
    2: [
      {id: 9, name: 'Produits laitiers',  portions: 1},
      {id: 1, name: 'Fruits et légumes',  portions: 1}
    ]
  },
  wednesday: {
    0: [
      {id: 1, name: 'Fruits et légumes',  portions: 1},
      {id: 9, name: 'Produits laitiers',  portions: 1},
      {id: 5, name: 'Féculents et produits céréaliers',  portions: 1}
    ],
    2: [
      {id: 9, name: 'Produits laitiers',  portions: 1},
      {id: 1, name: 'Fruits et légumes',  portions: 1}
    ]
  },
  thursday: {
    0: [
      {id: 1, name: 'Fruits et légumes',  portions: 1},
      {id: 9, name: 'Produits laitiers',  portions: 1},
      {id: 5, name: 'Féculents et produits céréaliers',  portions: 1}
    ],
    2: [
      {id: 9, name: 'Produits laitiers',  portions: 1},
      {id: 1, name: 'Fruits et légumes',  portions: 1}
    ]
  },
  friday: {
    0: [
      {id: 1, name: 'Fruits et légumes',  portions: 1},
      {id: 9, name: 'Produits laitiers',  portions: 1},
      {id: 5, name: 'Féculents et produits céréaliers',  portions: 1}
    ],
    2: [
      {id: 9, name: 'Produits laitiers',  portions: 1},
      {id: 1, name: 'Fruits et légumes',  portions: 1}
    ]
  },
  saturday: {
    0: [
      {id: 1, name: 'Fruits et légumes',  portions: 1},
      {id: 9, name: 'Produits laitiers',  portions: 1},
      {id: 5, name: 'Féculents et produits céréaliers',  portions: 1}
    ],
    1: [
      { id: 2, name: 'Viande rouge',  portions: 1}
    ],
    2: [
      {id: 9, name: 'Produits laitiers',  portions: 1},
      {id: 1, name: 'Fruits et légumes',  portions: 1}
    ]
  },
  sunday: {
    0: [
      {id: 1, name: 'Fruits et légumes',  portions: 1},
      {id: 9, name: 'Produits laitiers',  portions: 1},
      {id: 5, name: 'Féculents et produits céréaliers',  portions: 1}
    ],
    2: [
      {id: 9, name: 'Produits laitiers',  portions: 1},
      {id: 1, name: 'Fruits et légumes',  portions: 1}
    ]
  }
}
