import React from 'react';
import TodoItem from '../TodoItem';
import ListMUI from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';


const ListWithValues = ({props}) => {
  return (
    <ListMUI>
      {props.items.map((item, key) => {
        return (
          <TodoItem 
            key={item.id}
            item={item}
            removeFromList={props.removeFromList} />
        );
      })}
    </ListMUI>
  
  );
}

const ListEmpty = () => {
  return <>Não tem todos ativos</>
}

const List = (props) => {
  if(props.items.length == 0) 
    return <ListEmpty />

  else 
    return <ListWithValues props={props} />
};

export default List;
