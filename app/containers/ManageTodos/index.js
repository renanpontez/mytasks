import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TodoListComponent from '../../components/TodoList';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import {objectAssign} from 'object-assign';
import TodoAddComponent from '../../components/TodoAdd';

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

class TodoList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      todoName: '',
      todos: listOfTodos
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

  removeFromList = (itemId) => {
    let newList = this.state.todos;

    newList = newList.filter((val, i, arr) => {
      return val.id != itemId;
    });

    this.setState({todos: newList});
  }

  render() {
    return (
      <>
        <Container maxWidth="sm">
          <Paper>
            <ManageListComponent 
              list={this.state.list}
              removeFromList={this.removeFromList} />
          </Paper>
        </Container>
      </>
    );
  }

}



export default (TodoList);