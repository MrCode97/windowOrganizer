// src/contexts/text/index.tsx

import React, { createContext, useContext } from 'react';
import baseLangStrings from './default.json';

type LangKey = "en-US" | "de-DE";
type JsonLocalizedStrings = typeof baseLangStrings;

const baseTextContext = createContext<JsonLocalizedStrings>(baseLangStrings);
const TextProvidingWrapper = baseTextContext.Provider;

export function useImpressumString() {
    return useContext(baseTextContext).public.pages.impressum;
}

export function useImpressumAsset() {
    return useContext(baseTextContext).public.assets.impressum;
}

export function LangBadge(props: { lang: LangKey, setLang: React.Dispatch<React.SetStateAction<any>> }){
    const { title, enUS, deDE } = useContext(baseTextContext).public.pages.lang;
    return (
        <div id="lang-badge">
              <span>{ title }</span>&nbsp;<select value = {props.lang} onChange={(evt) => props.setLang(evt.target.value) }>
                 <option value= 'en-US'>{ enUS }</option>
                 <option value= 'de-DE'>{ deDE }</option>
               </select>
        </div>
    )
}

export function AggregateTextProvider(props: any){
    const [langStrings, setLangStrings] = React.useState<JsonLocalizedStrings>(baseLangStrings);
    React.useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`/lang/${props.lang}.json`);
                const jsonStrings = await response.json();
                setLangStrings(jsonStrings);
                console.log("lang changed to " + props.lang);
            } catch (error) {
                console.log("lang changed to " + error);
            }
        })();
    }, [props.lang])
    return (
        <TextProvidingWrapper value={langStrings}>
            {props.children}
        </TextProvidingWrapper>
    );
}
