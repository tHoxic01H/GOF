
import React,{ useState , useEffect , useRef, useCallback} from 'react';
import produce from 'immer';
import './App.css';

const  createWorld = (n,m)=>{
  const world = new Array(n).fill(new Array(m).fill(0))
    

      

  
  return world;
};
function App() {
  const [ world, setWorld ] = useState([]);
  const [ simulating , setSimulating ] = useState(false);
  const simulatingRef = useRef(simulating);
  const tailleVerticale=50,tailleHorizontale=100;
  const neighborsCoordinate = [
    [-1,-1],
    [-1,0],
    [-1,1],
    [0,1],
    [1,1],
    [1,0],
    [1,-1],
    [0,-1],
  ];
  simulatingRef.current = simulating ;
  

  const simulate = () => {

    simulatingRef.current = !simulating;
    setSimulating((oldState) => !oldState);
    console.log(simulating ? "starting..." : "breaking...");
    runSimulation();
  };
  
  const runSimulation = useCallback(() => {
    if (!simulatingRef.current){
      return;
    }
    console.log('operation');
    
    setWorld(world => {
      return produce(world , worldCondition  => {
          for( let n = 0; n < world.length; n++ ) {
            for( let m = 0; m < world[n].length; m++) {

              let neighborsAlive = 0;
              for (let i = 0; i < neighborsCoordinate.length; i++) {
                const neighborsY = neighborsCoordinate[i][0] + n;
                const neighborsX = neighborsCoordinate[i][1] + m;
                if (neighborsY >= 0 && neighborsY < tailleVerticale && neighborsX >= 0 && neighborsX < tailleHorizontale) {
                  neighborsAlive += world[neighborsY][neighborsX];
                }
              }
              console.log(neighborsAlive);
              if (world[n][m] && (neighborsAlive < 2 || neighborsAlive > 3)){
                // if cellule is alive 
                  worldCondition[n][m] = 0;

              }
              else if (!world[n][m] && neighborsAlive === 3) { 
                // if cellule is actually dead
                  worldCondition[n][m] = 1;
              }
            }
          }

        }
      );
    });
 
    setTimeout(runSimulation, 0);
  },[]);

  const handleSelectAlive = (n,m) => {
    const newWorld = produce( world , newWorldState => {
      newWorldState[n][m] = newWorldState[n][m] ? 0 : 1;
    })
    setWorld(newWorld);
  };

  useEffect(()=>{
    setWorld(createWorld(tailleVerticale,tailleHorizontale));
  },[]);
 
  return (
    <div style={{ paddingTop: "10vh", paddingBotton:"10vh"}}>
      <button style={{ marginLeft:"10%",width:'100px',height:"100px"}} onClick={simulate}>
        {
          simulating ? "break" : "play"
        }
      </button>
      <div
        style={{
          border:"1px black solid",
          width:"80%",
          height:"80vh",
          margin:'auto',
        }}
      >
        
        <table
          cellSpacing="0"
        >
        <tbody>
          {
            world.map((row,i)=>{
              return (<tr key={i}>
                {
                  row.map((cellule,ic) => {
                    return (
                      <th 
                        key={`${i} ${ic}`} 
                        style={{
                          width: "5px",
                          height: "5px",
                          border: "1px black solid",
                          background: cellule ? "black" : "white",
                        }}
                        onClick={() => handleSelectAlive(i,ic)}
                      >

                      </th>
                    )
                  })
                }
              </tr>
              )
            })
          }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
