import './App.css';
import ReactAnime from 'react-animejs';
import PersonView from "./views/PersonView";
const {Anime} = ReactAnime;

function App() {
  const rootYear = 1980;
  let i = 0;
  const data = [
    generatePersonFromData('Goodwin Ogbuehi', i++, rootYear, rootYear, 0),
    generatePersonFromData('Kate Cowcher', i++, 1982, rootYear, 0),
    generatePersonFromData('Elliott Ogbuehi', i++, 2015, rootYear, 0),
    generatePersonFromData('Lilian Ogbuehi', i++, 2019, rootYear, 0),
    generatePersonFromData('Stephen Ogbuehi', i++, 1947, rootYear, 0),
    generatePersonFromData('Elizabeth Pastoriza', i++, 1959, rootYear, 0),
    generatePersonFromData('Christine Aynsley', i++, 1954, rootYear, 2),
    generatePersonFromData('David George Cowcher', i++, 1954, rootYear, 2),
    generatePersonFromData('Steven Ogbuehi', i++, 1977, rootYear, -1),
    generatePersonFromData('Michael Tabora', i++, 1983, rootYear, 1),
    generatePersonFromData('Christopher Cowcher', i++, 1984, rootYear, 2),
    generatePersonFromData('Anna Cowcher', i++, 1988, rootYear, 2),
    generatePersonFromData('Nadine Rodriguez', i++, 1940, rootYear, 1),
    generatePersonFromData('Enrique Pastoriza', i++, 1940, rootYear, 1),
    generatePersonFromData('Matthew Ogbuehi', i++, 1990, rootYear, 1),
    generatePersonFromData('Nicholas Ogbuehi', i++, 1991, rootYear, 1),
    generatePersonFromData('Virginia Pastoriza', i++, 2006, rootYear, 1),
    generatePersonFromData('Ifeoma', i++, 1958, rootYear, 1),
  ];

  const personNodes = new Map();
  data.forEach((personData) => {
    const {id} = personData;
    personNodes.set(id, personData);
  });

  data.sort((a,b) => {
    const aHops = a.hops;
    const bHops = b.hops;
    const aBirthYear = a.birthYear;
    const bBirthYear = b.birthYear;
    if (aHops < bHops) return -1;
    if (aHops > bHops) return 1;
    if (aBirthYear < bBirthYear) return -1;
    if (aBirthYear > bBirthYear) return 1;
    return 0;
  })
  const sectorMap = new Map();
  const refinedData = data.map((personData) => {
    const {initial, hops} = personData;
    const {yearSector} = personData;
    if (!sectorMap.has(yearSector)) sectorMap.set(yearSector, [])
    const sectorArray = sectorMap.get(yearSector);

    initial.translateX = -500 + (sectorArray.length + hops) * 150;
    sectorArray.push(initial);
    return personData;
  })
  const relationshipData = [
    gs(personNodes, 0, 1),
    gs(personNodes, 4, 5),
    gs(personNodes, 6, 7),
    gs(personNodes, 12, 13),
    gp(personNodes, 0, 2),
    gp(personNodes, 0, 3),
    gp(personNodes, 1, 2),
    gp(personNodes, 1, 3),
    gp(personNodes, 4, 0),
    gp(personNodes, 5, 0),
    gp(personNodes, 4, 8),
    gp(personNodes, 5, 8),
    gp(personNodes, 5, 9),
    gp(personNodes, 6, 1),
    gp(personNodes, 7, 1),
    gp(personNodes, 6, 10),
    gp(personNodes, 7, 10),
    gp(personNodes, 6, 11),
    gp(personNodes, 7, 11),
    gp(personNodes, 12, 5),
    gp(personNodes, 13, 5),

    gp(personNodes, 5, 16),

    gp(personNodes, 4, 14),
    gp(personNodes, 4, 15),
    gp(personNodes, 17, 14),
    gp(personNodes, 17, 15),
    gs(personNodes, 17, 4),
  ];
  const triads = generateFamilyTriangle(relationshipData, personNodes);

  const initial = refinedData.map(({initial}) => initial);
  return (
    <div className="App">
      <header className="App-header">
        <svg width="1500" height="500">
          {/*<circle cx="350" cy="150" r="40" stroke="green" stroke-width="4" fill="yellow" />*/}
          {relationshipData.map(({path}) => path)}
          {triads}
        </svg>
        <Anime
          initial={initial}
        >
          {refinedData.map(({jsx}) => jsx)}
        </Anime>
      </header>
    </div>
  );
}

export default App;

const generatePersonFromData = (
  name, id,
  birthYear,
  rootYear,
  hops
) => {
  const identifier = `person-${id}`;

  const jsx = <PersonView key={identifier} id={identifier} hops={hops}>
    {`${birthYear} - ${name}`}
  </PersonView>;
  const yearSector = birthYear - (birthYear%18);
  const yearDiff = (yearSector - rootYear) * 5;

  let x = 0;

  const initial = {
    targets: `#${identifier}`,
    translateX: x,
    translateY: yearDiff,
    easing: "linear",
    duration: 50
  }

  return {
    id,
    name,
    birthYear,
    identifier,
    jsx,
    initial,
    yearSector,
    hops
  }
}

const relationshipVisuals = {
  sp: {
    stroke: 'red',
    name: 'spouse'
  },
  pc: {
    stroke: 'green',
    name: 'parent-child'
  }
}
const gr = (peopleMap, relationshipType, id1, id2) => {
  return generateRelationship(relationshipType, peopleMap.get(id1), peopleMap.get(id2));
}

const gs = (peopleMap, id1, id2) => {
  const relationship = gr(peopleMap, 'sp', id1, id2);
  const p1 = peopleMap.get(id1);
  const p2 = peopleMap.get(id2);

  if (!p1.sps) {
    p1.sps = new Map();
  }
  const p1Sps = p1.sps;
  if (!p1Sps.has(relationship.key)) {
    p1Sps.set(relationship.key, relationship);
  }

  if (!p2.sps) {
    p2.sps = new Map();
  }
  const p2Sps = p2.sps;
  if (!p2Sps.has(relationship.key)) {
    p2Sps.set(relationship.key, relationship);
  }

  if (!p1.sls) {
    p1.sls = new Set();
  }
  if (!p2.sls) {
    p2.sls = new Set();
  }

  p1.sls.add(p2.id);
  p2.sls.add(p1.id);

  const {personPoints} = relationship;
  p1.point = personPoints.get(id1);
  p2.point = personPoints.get(id2);
  return relationship;
}
const gp = (peopleMap, id1, id2) => {
  const relationship = gr(peopleMap, 'pc', id1, id2);
  const p1 = peopleMap.get(id1);
  const p2 = peopleMap.get(id2);

  if (!p1.pcs) {
    p1.pcs = new Map();
  }
  const p1Pcs = p1.pcs;
  if (!p1Pcs.has(relationship.key)) {
    p1Pcs.set(relationship.key, relationship);
  }

  if (!p2.pcs) {
    p2.pcs = new Map();
  }
  const p2Pcs = p2.pcs;
  if (!p2Pcs.has(relationship.key)) {
    p2Pcs.set(relationship.key, relationship);
  }

  if (!p1.pls) {
    p1.pls = new Set();
  }
  const p1PLs = p1.pls;
  p1PLs.add(p2.id);

  if (!p2.pls) {
    p2.pls = new Set();
  }
  const p2PLs = p2.pls;
  p2PLs.add(p1.id);
  const {personPoints} = relationship;
  p1.point = personPoints.get(id1);
  p2.point = personPoints.get(id2);
  console.log({p1, p2})
  return relationship;
}
const generateRelationship = (relationshipType, person1, person2) => {
  const people = [person1, person2];
  people.sort(({ id: a }, { id: b }) => {
    return (a < b) ? -1 : (a > b) ? 1 : 0;
  });
  const personIds = people.map(({id}) => id);
  const key = personIds.join('-');
  const link = new Set(personIds);

  // <path d="M 10 10 C 40 10, 65 10, 95 80 S 150 150, 180 80 L 20 20 L 575 440" stroke="black" fill="transparent"/>
  // Draw line between
  const zeroZero = { x: 800, y: 270 };
  const person1Point = {
    x: person1.initial.translateX + zeroZero.x,
    y: person1.initial.translateY + zeroZero.y
  };
  const person2Point = {
    x: person2.initial.translateX + zeroZero.x,
    y: person2.initial.translateY + zeroZero.y
  };

  const personPoints = new Map();
  personPoints.set(person1.id, person1Point);
  personPoints.set(person2.id, person2Point);

  // construct the path string
  const pathString = `M ${person1Point.x} ${person1Point.y} L ${person2Point.x} ${person2Point.y}`;
  const pathStroke = (relationshipVisuals[relationshipType] && relationshipVisuals[relationshipType].stroke) || 'black';
  const path = <path key={key} d={pathString} stroke={pathStroke} fill="transparent" />
  return {
    key,
    link,
    path,
    personIds,
    personPoints
  }
}

const generateFamilyTriangle = (relationshipArray, peopleMap) => {
  // loop through people to find triads
  const peopleArray = Array.from(peopleMap.values());
  const childrenMap = new Map();
  peopleArray.forEach((person) => {
    // const {pcs} = person;
    // if (pcs) {
    //
    // }
    const {id, pls, sls} = person;

    const spouseArray = sls ? Array.from(sls.values()): [];
    const parentalArray = pls ? Array.from(pls.values()) : [];
    spouseArray.forEach((spouseId) => {
      if (!peopleMap.has(spouseId)) {
        return;
      }
      const spouse = peopleMap.get(spouseId);
      const spousePls = spouse.pls ? Array.from(spouse.pls.values()) : [];
      for(let i in parentalArray) {
        const aPersonId = parentalArray[i];
        const triadArray = [id, spouse.id, aPersonId];
        triadArray.sort((a,b) => ((a < b) ? -1 : (a > b) ? 1 : 0));
        const triadKey = triadArray.join('-');
        if (childrenMap.has(triadKey)) continue;
        if (spousePls.indexOf(aPersonId) > -1) {
          // create triad
          childrenMap.set(triadKey, triadArray);
        }
      }
    })

    // console.log(id, name);
  })


  // Make Paths
  const triadArray = Array.from(childrenMap.values());
  return triadArray.map((triad, index) => {
    let pathString = '';
    triad.forEach((id, index) => {
      //console.log(peopleMap.get(id));
      const {point: {x, y}} = peopleMap.get(id)
      if (index === 0) {
        // Move

        pathString += 'M ';
      } else {
        pathString += ' L ';
      }
      pathString += `${x} ${y}`;
    })
    return <path key={`triad-${index}`} d={pathString} stroke={'transparent'} fill="#202040" />
  });
}