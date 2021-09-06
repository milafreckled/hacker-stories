
import React, { useState, useEffect } from "react";
import useHoverFocus from './isHovered'
import HeroPattern from './HeroPattern'
import SearchForm from "./SearchForm"
import styles from './App.module.css';
import axios from 'axios'
//import cs from 'classnames';
import { ReactComponent as Check } from './check.svg'
import logo from './physics.svg'
import { List, Item } from './List'
type Story = {
  objectID: number,
  url: string,
  title: string,
  author: string,
  num_comments: number,
  points: number,
}

type Stories = Array<Story>
type LastSearchesProps = {
  lastSearches: string[],
  onLastSearch: () => void
}

type StoriesState = {
  page: number,
  data: Stories,
  isLoading: boolean,
  isError: boolean,
}
type StoriesAction = 
  | StoriesFetchInitAction
  | StoriesFetchSuccessAction
  | StoriesFetchFailureAction
  | StoriesRemoveAction

interface StoriesFetchInitAction{
  type: 'STORIES_FETCH_INIT';
  payload?: any
}
interface StoriesFetchSuccessAction{
  type: 'STORIES_FETCH_SUCCESS';
  payload?: any
}
interface StoriesFetchFailureAction{
  type: 'STORIES_FETCH_FAILURE';
  payload?: any
}
interface StoriesRemoveAction{
  type: 'REMOVE_STORY';
  payload?: any
}


  
const initialStories: Stories = [
  { title: 'React',
url: 'https://reactjs.org/',
author: 'Jordan Walke',
num_comments: 3,
points: 4,
objectID: 0,
},
{ 
  title: 'Redux',
url: 'https://redux.js.org/',
author: 'Dan Abramov, Andrew Clark',
num_comments: 2,
points: 5,
objectID: 1,
}
]
const getAsyncStories = () => 
  new Promise((resolve , reject)=> setTimeout(reject, 2000)
)
const storiesReducer = (
  state: StoriesState,
  action: StoriesAction
) => {
  switch(action.type){ 
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case'STORIES_FETCH_SUCCESS': 
        return{
          ...state,
        isLoading: false,
        isError: false,
        data: action.payload.page === 0
        ?action.payload.list
        :state.data.concat(action.payload.list)
        };
      case'STORIES_FETCH_FAILURE': 
        return{
          ...state,
        isLoading: false,
        isError: true
        }
    case 'REMOVE_STORY':
      return{
        ...state,
        data: state.data.filter(
        story => action.payload.objectID !== story.objectID
      )}
    default:
      throw new Error(); 
  }
}

const API_START= "https://hn.algolia.com/api/v1/";
const API_SEARCH_PARAM = "search?query=";
const API_PAGE_QUERY = "&page=";
function App() {
  console.log('B: App')
  const storiesReducer = (
    state: StoriesState,
    action: StoriesAction,
  ) => {
    switch(action.type){ 
      case 'STORIES_FETCH_INIT':
        return {
          ...state,
          isLoading: true,
          isError: false,
        };
      case'STORIES_FETCH_SUCCESS': 
          return{
            ...state,
          isLoading: false,
          isError: false,
          data: action.payload.page === 0
          ?action.payload.list
          :state.data.concat(action.payload.list),
          page: action.payload.page
          };
        case'STORIES_FETCH_FAILURE': 
          return{
            ...state,
          isLoading: false,
          isError: true
          }
      case 'REMOVE_STORY':
        return{
          ...state,
          data: state.data.filter(
          story => action.payload.objectID !== story.objectID
        )}
      default:
        throw new Error(); 
    }
  }

    const useSemiPersistentState = (key: string, initialState: string) : [string, (newValue: string) => void] => {
      const isMounted = React.useRef(false)
      const [value, setValue] = useState(
        localStorage.getItem(key) || initialState
      );
        useEffect(() =>{
          if (!isMounted.current){
            isMounted.current = true
          }else{
            console.log('A')
          localStorage.setItem(key, value)
          }
        }, [value, key])
        return [value, setValue]
    }
  const getUrl = (searchTerm: string, page: number) => `${API_START}${API_SEARCH_PARAM}?${searchTerm}&${API_PAGE_QUERY}${page}`;
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React')
 
  const [stories, dispatchStories] = React.useReducer<typeof storiesReducer>(
    storiesReducer,
    { data: [], page: 0, isLoading: false, isError: false }
  );
  //const searchedStories = stories.data.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()))
  const [url, setUrl] = React.useState(`${API_START}${searchTerm}`)
  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    event.preventDefault();
  }
  const handleSearch = (searchTerm: string, page: number) => {
    const url = getUrl(searchTerm, page);
    setUrls(urls.concat(url));
  }
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const url = `${API_START}${API_SEARCH_PARAM}${searchTerm}${API_PAGE_QUERY}`;
    handleSearch(searchTerm, 0);
    setUrls(urls.concat(url));
    //setUrl(`${API_ENDPOINT}${searchTerm}`)
    event.preventDefault();
  }
  const getSumComments = (stories: StoriesState) => {
    return stories.data.reduce((res: number, val: Story) => res + val.num_comments, 0)
  }
 const sumComments = React.useMemo(() => getSumComments(stories), [stories])
 const [urls, setUrls] = React.useState([
  getUrl(searchTerm, 0),
]);
const extractSearchTerm = (url: string) => url.substring(url.lastIndexOf(API_SEARCH_PARAM+1), url.lastIndexOf('&'));

const getLastSearches = (urls: string[]) =>{
  let sortedUrls = urls.map(url => url.toLowerCase()).sort();
  sortedUrls.reduce((acc: string[], curr, idx) => { if (curr !== sortedUrls[idx + 1] && idx !== sortedUrls.length - 1){ acc.push(curr) } return acc;}, []);
  sortedUrls.slice(-6).slice(0, -1).map(extractSearchTerm);
  return sortedUrls;
};
const handleLastSearch = (searchTerm: string) => {
  setSearchTerm(searchTerm);
const url = `${API_START}${searchTerm}`;
handleSearch(searchTerm, 0);
setUrls(urls.concat(url));
}
const handleMore = () => {
  const lastUrl = urls[urls.length-1];
  const searchTerm = extractSearchTerm(lastUrl);
  handleSearch(searchTerm, stories.page + 1);
}
const lastSearches = getLastSearches(urls);
const handleFetchStories = React.useCallback(async () =>{
    dispatchStories({type: "STORIES_FETCH_INIT"})
    try{
      const lastUrl = urls[urls.length - 1]
      const result = await axios.get(lastUrl)
   
    dispatchStories(
      { type: 'STORIES_FETCH_SUCCESS', payload: {
        list: result.data.hits,
        page: result.data.page,}
      }
    )}catch{
      dispatchStories(
        { type: 'STORIES_FETCH_FAILURE'}
    )
    }
  }, [urls])
    

  
React.useEffect(() =>{
  handleFetchStories()
}, [handleFetchStories])

  const handleRemoveStory = (item: Story)  => {
      const newStories = stories.data.filter((story: Story) => item.objectID !== story.objectID)
      dispatchStories(newStories);
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: newStories,
      });
  };

  const [elem, isHovered] = useHoverFocus();

  const LastSearches = ({ lastSearches, onLastSearch }: LastSearchesProps) => (
    <>
    {lastSearches.map((searchTerm, index) => (<button key={searchTerm+index} type="button" onClick = {() => handleLastSearch}>
         {searchTerm}
         </button>))}
    </>
  )
  return (
    <div className={styles.container}>
      <img src={logo} className="react-svg-pattern" height="20px" width="20px" style={{display: "inline"}}/>
        <h1 className={styles.headlinePrimary}>My Hacker Stories!</h1>
        <SearchForm searchTerm={searchTerm} onSearchInput={handleSearchInput} onSearchSubmit={handleSearchSubmit} />
       <hr/>
       
       {stories.isError && <p>Something went wrong...</p>}
       <List list = { stories.data } onRemoveItem = { handleRemoveStory }  />
       {stories.isLoading?(<p>Loading...</p>):(
      <button type="button" onClick = {handleMore}>More</button>
       
       )}
       <hr />
      
       <input ref = {elem} />
       {isHovered && <p>A hint!</p>}
      
       
    </div>
  );
}

export default App;
export { List, Item }


