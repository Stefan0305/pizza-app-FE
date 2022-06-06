import React, { useState, createContext, useEffect } from "react";
import Api from "../Api";

const TagContext = createContext();

const TagProvider = ({ children }) => {
  const [tags, setTags] = useState([]);
  useEffect(function(){
    Api().get('/tags').then(response => { 
        setTags(response.data);
    })
  },[])
  const value = { tags, setTags };
  return <TagContext.Provider value={value}>{children}</TagContext.Provider>;
};

export { TagContext, TagProvider };