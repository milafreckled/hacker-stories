import { render, screen } from '@testing-library/react';
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import renderer from 'react-test-renderer'
import App, {List, Item} from './App';
import SearchForm from './SearchForm';
//import { SearchForm } from './SearchForm'
//import { InputWithLabel } from './InputWithLabel'

/*test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});*/

describe('Item', ()=>{
  const item = {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  };
  let component;
  const handleRemoveItem = jest.fn();
  beforeEach(()=>{
    component = renderer.create(<Item item={item} onRemoveItem={handleRemoveItem} />)
  })
  
  it('renders all properties', ()=>{
   

    expect(component.root.findByType('a').props.href).toEqual(
      'https://reactjs.org/'
    );
    expect(component.root.findAllByProps({ children: 'Jordan Walke'}).length).toEqual(1);
  });
  it('calls onRemoveItem on button click', ()=>{


    component.root.findByType('button').props.onClick();
    expect(handleRemoveItem).toHaveBeenCalledTimes(1);
    expect(handleRemoveItem).toHaveBeenCalledWith(item);

    expect(component.root.findAllByType(Item).length).toEqual(1);
    
  });
  test('renders snapshot', ()=>{
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot;
  })
})
describe('List', ()=>{
  const list = [
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
it ('renders two items', ()=>{
  const component = renderer.create(<List list={list} />);
  expect(component.root.findAllByType(Item).length).toEqual(2);
})
  
})
describe('SearchForm', ()=>{
  const searchFormProps = {
    searchTerm: 'React', 
    onSearchInput: jest.fn(),
    onSearchSubmit: jest.fn(),
  }

  let component;

  beforeEach(()=>{
    component = renderer.create(<SearchForm {...searchFormProps } />);
  })
  it('renders the input field with its value', ()=>{
  const value = component.root.findByType('input').props.value;
  expect(value).toEqual('React');
  })
  it('changes the input field', ()=>{
    const pseudoEvent = { target: 'Redux' };
    component.root.findByType('input').props.onChange(pseudoEvent);
    expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
    expect(searchFormProps.onSearchInput).toHaveBeenCalledWith(pseudoEvent);

  });
  it('submit the form', ()=>{
    const pseudoEvent = { };
    component.root.findByType('form').props.onSubmit(pseudoEvent);
    expect(searchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
    expect(searchFormProps.onSearchSubmit).toHaveBeenCalledWith(pseudoEvent);

  });

})
describe('App', ()=>{
  it('succeds fetching data with a list', async ()=>{
    const list = [
      {title: 'React',
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
    ];
    const response = {
      data: { 
        hits: list,
      }
    };
    jest.mock('axios');
    axios.get.mockImplementationOnce(() => Promise.resolve(response));

    let component;
    await renderer.act(async () =>{
      component = renderer.create(<App />);
    });
    expect(component.root.findByType(List).props.list).toEqual(list);
  })
})