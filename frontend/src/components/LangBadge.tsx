import React, { createContext, useContext } from 'react';
import baseLangStrings from './../contexts/text/en-US.json';

type LangKey = "en-US" | "de-DE";
type JsonLocalizedStrings = typeof baseLangStrings;

const baseTextContext = createContext<JsonLocalizedStrings>(baseLangStrings);
const TextProvidingWrapper = baseTextContext.Provider;

export function LangBadge(props: { lang: LangKey, setLang: React.Dispatch<React.SetStateAction<any>> }){
    const { title, enUS, deDE } = useContext(baseTextContext).public.pages.lang;
    return (
        <div id="lang-badge">
              <span>{ title }</span>&nbsp;<select value={props.lang} onChange={(evt) => { 
                 props.setLang(evt.target.value); console.log(evt.target.value); localStorage.setItem('lang', evt.target.value); }}>
                 <option value='en-US'>{ enUS }</option>
                 <option value='de-DE'>{ deDE }</option>
               </select>
        </div>
    )
}