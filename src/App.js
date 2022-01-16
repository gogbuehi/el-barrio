import './App.css';
import ReactAnime from 'react-animejs';
import PersonView from "./views/PersonView";
const {Anime} = ReactAnime;

function App() {
  const rootYear = 1980;
  let i = 0;
  const data = [
    generatePersonFromData('Goodwin Ogbuehi', i++, rootYear, rootYear, 0),
    generatePersonFromData('Kate Cowcher', i++, 1982, rootYear, 1),
    generatePersonFromData('Elliott Ogbuehi', i++, 2015, rootYear, 1),
    generatePersonFromData('Lilian Ogbuehi', i++, 2019, rootYear, 1),
    generatePersonFromData('Stephen Ogbuehi', i++, 1947, rootYear, 1),
    generatePersonFromData('Elizabeth Pastoriza', i++, 1959, rootYear, 1),
    generatePersonFromData('Christine Aynsley', i++, 1954, rootYear, 2),
    generatePersonFromData('David George Cowcher', i++, 1954, rootYear, 2),
    generatePersonFromData('Steven Ogbuehi', i++, 1977, rootYear, 2),
    generatePersonFromData('Michael Tabora', i++, 1983, rootYear, 2),
    generatePersonFromData('Christopher Cowcher', i++, 1984, rootYear, 3),
    generatePersonFromData('Anna Cowcher', i++, 1988, rootYear, 3),
    generatePersonFromData('Nadine Rodriguez', i++, 1940, rootYear, 2),
    generatePersonFromData('Enrique Pastoriza', i++, 1940, rootYear, 2),
    generatePersonFromData('Matthew Ogbuehi', i++, 1990, rootYear, 2),
    generatePersonFromData('Nicholas Ogbuehi', i++, 1991, rootYear, 2),
    generatePersonFromData('Virginia Pastoriza', i++, 2006, rootYear, 2),
  ]
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
    const {initial} = personData;
    const {yearSector} = personData;
    console.log({yearSector});
    if (!sectorMap.has(yearSector)) sectorMap.set(yearSector, [])
    const sectorArray = sectorMap.get(yearSector);

    console.log(sectorArray.length);
    initial.translateX = -250 + sectorArray.length * 150;
    sectorArray.push(initial);
    return personData;
  })
  const initial = refinedData.map(({initial}) => initial);
  console.log({initial});
  return (
    <div className="App">
      <header className="App-header">
        <svg width="1000" height="500">
          {/*<circle cx="350" cy="150" r="40" stroke="green" stroke-width="4" fill="yellow" />*/}
          {/*<rect x="10" y="10" width="100" height="25" />*/}
          <path d="M 10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80" stroke="black" fill="transparent"/>
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
    {name}
  </PersonView>;
  const yearSector = birthYear - (birthYear%10);
  const yearDiff = (yearSector - rootYear) * 5;

  let x = 0;
  let y = yearDiff;
  console.log({name, x, y});
  // const idBitFlip = (id % 2) ? -1 : 1;
  if (id !== 0) {

    // x = id * 25;
    // y = idBitFlip * 100 * id;

  }
  const initial = {
    targets: `#${identifier}`,
    translateX: x,
    translateY: y,
    easing: "linear"
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