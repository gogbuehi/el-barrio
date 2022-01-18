import styled from "styled-components";

const PersonView = ({id, hops, children}) => {
  switch (hops) {
    case 0:
      return <HopsView0 id={id}>{children}</HopsView0>;
    case 1:
      return <HopsView1 id={id}>{children}</HopsView1>;
    case 2:
      return <HopsView2 id={id}>{children}</HopsView2>;
    default:
      return <HopsView3 id={id}>{children}</HopsView3>;

  }
}

export default PersonView;

const HopsView0 = styled.div`
  border: solid 4px white;
  border-radius: 5px;
  padding: 10px;
  position: fixed;
  top: 50%;
  left: 50%;
  font-size: x-small;
  background-color: #282c34;
  
`;

const HopsView1 = styled(HopsView0)`
  border: solid 1px yellow;
`;

const HopsView2 = styled(HopsView0)`
  border: solid 1px blue;
`;

const HopsView3 = styled(HopsView0)`
  border: solid 1px red;
`;