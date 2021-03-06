import React from 'react';
import Container from '@material-ui/core/Container';
import ManageList from '../../components/ManageList';
import Grid from '@material-ui/core/Grid';


const listOfTodos =  [
  {
    id: 1,
    title: "Work on that thing",
  },
  {
    id: 2,
    title: "Work on another thing",
  },
];

const listOfLists = [
  {
    id: 1,
    title: 'List 1',
    items: listOfTodos
  },
  {
    id: 2,
    title: 'List 1',
    items: listOfTodos
  },
]

class TodoList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: listOfLists,
      todoName: '',
    }

    this.handleTodoName = this.handleTodoName.bind(this);
    this.addToList = this.addToList.bind(this);
    this.removeFromList = this.removeFromList.bind(this);
  }

  handleTodoName = (textField) => {
    this.setState({todoName: textField.value});
  }

  addToList = (e) => {
    e.preventDefault();

    let newList = this.state.todos;
    let nextId = this.state.todos.length > 0 ? this.state.todos[this.state.todos.length-1].id + 1 : 1;

    newList.push({
      id: nextId,
      title: e.target[0].value
    });


    this.setState({todos: newList, todoName: ''});
  }

  removeFromList = (listId, itemId) => {
    let newList = this.state.listOfLists;
    newList = newList.filter((val) => {
      return val.id = listId;
    });
    
    let newListTodos = newList.items;
    newListTodos = newListTodos.filter((val) => {
      return val.id != itemId;
    });

    this.setState({listOfTodos: newList});
  }

  render() {
    return (
      <>
        <Grid container>
          <ManageList 
            list={this.state.list}
            todoName={this.state.todoName}
            addToList={this.addToList}
            handleTodoName={this.handleTodoName}
            removeFromList={this.removeFromList} />
        </Grid>
      </>
    );
  }

}



export default (TodoList);