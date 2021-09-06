import React from "react";
import styles from "./App.module.css"

type SearchFormProps = {
  searchTerm: string;
  onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}
type InputWithLabelProps = {
  id: string;
    value: string;
    type?: string;
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isFocused?: boolean;
    children: React.ReactNode
}
const InputWithLabel = ({ 
    id,
    value,
    type,
    onInputChange,
    isFocused,
    children
  }: InputWithLabelProps) => {
    //A
    const inputRef = React.useRef<HTMLInputElement>(null)
    //B
    React.useEffect(()=>{
      if (isFocused && inputRef.current){
        //D
        inputRef.current.focus()
      }
    }, [isFocused])
    return(
    <>
 
    <label htmlFor={id} className={styles.label}>{children}</label>
    &nbsp;
    <input ref ={inputRef} type={type} id={id} value={value} onChange={onInputChange} className={styles.input}/>
    
    </>
    )
  }
const SearchForm = ({searchTerm, onSearchInput, onSearchSubmit}: SearchFormProps) => (
   <>
    <form onSubmit={onSearchSubmit} className={styles.searchForm}>
      <InputWithLabel id="search" value={searchTerm} isFocused onInputChange={onSearchInput}>
        <strong>Search:</strong>
      </InputWithLabel>
      <button type="submit" disabled={!searchTerm} className={`${styles.button} ${styles.buttonLarge}`}>Search</button>
    </form>
    </>
    
    )
export default SearchForm;