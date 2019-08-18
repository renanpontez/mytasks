import React from 'react';
import ManageItem from '../ManageItem';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';


const ListWithValues = ({props}) => {
  return (
    <Grid item xs={3}>
        {props.list.map((item) => {
          return (
            <>
             <h1>{item.title}</h1>

              <ManageItem 
                key={item.id}
                item={item}
                removeFromList={props.removeFromList}
                {...props} />
            </>
          );
        })}
    </Grid>
  
  );
}

const ListEmpty = () => {
  return <>Crie sua primeira lista</>
}

const List = (props) => {
  if(props.list.length == 0) 
    return <ListEmpty />

  else 
    return <ListWithValues props={props} />
};

export default List;
