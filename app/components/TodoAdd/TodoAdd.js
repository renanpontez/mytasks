import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  container: {
   
  },
  hidden: {
    display: "none"
  },
  fullWidth: {
    width: "100%"
  }
}));


const Item = (props) => {
  const classes = useStyles();

  return (
    <ListItem>
      <form onSubmit={props.addToList} className={classes.fullWidth}>
       <TextField
        placeholder="What's your next TODO?"
        value={props.todoName}
        onChange={props.handleTodoName}
        margin="dense"
        fullWidth={true} />

        <button type="submit" className={classes.hidden} />
      </form>
      
    </ListItem>
  );
};


export default Item;
