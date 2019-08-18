import React from 'react';
import Paper from '@material-ui/core/Paper';
import TodoAddComponent from '../TodoAdd';
import TodoListComponent from '../TodoList';

const Item = (props) => {
  return (
    <Paper>
      <TodoAddComponent 
        addToList={props.addToList} 
        handleTodoName={props.handleTodoName} />

      <TodoListComponent 
        items={props.item.items}
        removeFromList={props.removeFromList} />
    </Paper>
  );
};


export default Item;
