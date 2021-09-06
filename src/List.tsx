import React from 'react';
import cs from 'classnames';
import styles from './App.module.css'
import { sortBy } from 'lodash';
type Story = {
      objectID: number,
      url: string,
      title: string,
      author: string,
      num_comments: number,
      points: number,
    }
    
type Stories = Array<Story>
type ListProps = {
      list: Stories;
      onRemoveItem: (item: Story) => void;
    }
    type ItemProps = {
      item: Story;
      onRemoveItem: (item: Story) => void;
    }
const List = ({ list, onRemoveItem }: ListProps) => {

    const [sort, setSort] = React.useState({
      sortKey: 'NONE',
      isReverse: false,
    })
    const SORTS: any = {
          NONE: (list: Stories) => list,
          TITLE: (list: Stories) => sortBy(list, 'title'),
          AUTHOR: (list: Stories) => sortBy(list, 'author'),
          NUM_COMMENTS: (list: Stories) => sortBy(list, 'num_comments'),
          POINT: (list: Stories) => sortBy(list, 'points'),
    }
    const handleSort = (sortKey: string, isReverse: boolean) => {
          setSort({sortKey, isReverse});
    }
    const sortFunction = SORTS[sort.sortKey];
    const sortedList = sort.isReverse?sortFunction(list).reverse():sortFunction(list);
      return(
      <>
      {sortedList.map((item: Story) => (
        <Item key={item.objectID}
              item={item}
              onRemoveItem={onRemoveItem}
        /> ))}
      </>
      )
};
const Item = ({ item, onRemoveItem }: ItemProps) =>(
      <>
      <div className={styles.item}>
            <span style={{width: '40%'}}><a href={item.url}>{item.title}</a></span>
            <span style={{width: '30%'}}>{item.author}</span>
            <span style={{width: '10%'}}>{item.num_comments}</span>
            <span style={{width: '10%'}}>{item.points}</span>
            <span style={{width: '10%'}}>
                  <button type="button" onClick={ ()=> {onRemoveItem(item)} } className={cs(styles.button, styles.buttonLarge)}>Dismiss</button>
            </span>
      </div>
      </>
      
)
export { List, Item };