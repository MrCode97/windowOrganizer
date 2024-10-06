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

export function useAppStrings() {
    return useContext(baseTextContext).public.pages.app;
}

export function useLangStrings() {
    return useContext(baseTextContext).public.pages.lang;
}

export function useAdventCalendarRegistrationFormStrings() {
    return useContext(baseTextContext).public.pages.adventCalendarRegistrationForm;
}

export function useCommentSectionStrings() {
    return useContext(baseTextContext).public.pages.commentSection;
}

export function useDefaultCalendarStrings() {
    return useContext(baseTextContext).public.pages.defaultCalendar;
}

export function useGalleryStrings() {
    return useContext(baseTextContext).public.pages.gallery;
}

export function useInfoSectionStrings() {
    return useContext(baseTextContext).public.pages.infoSection;
}

export function useLoginStrings() {
    return useContext(baseTextContext).public.pages.login;
}

export function useMyCalendarsStrings() {
    return useContext(baseTextContext).public.pages.myCalendars;
}

export function useMyWindowsStrings() {
    return useContext(baseTextContext).public.pages.myWindows;
}

export function useOverviewMapStrings() {
    return useContext(baseTextContext).public.pages.overviewMap;
}

export function useOwnerEditSectionStrings() {
    return useContext(baseTextContext).public.pages.ownerEditSection;
}

export function useSlidingWindowStrings() {
    return useContext(baseTextContext).public.pages.slidingWindow;
}

export function useUploadStrings() {
    return useContext(baseTextContext).public.pages.upload;
}

export function useUserRegistrationStrings() {
    return useContext(baseTextContext).public.pages.userRegistrationForm;
}

export function useUserSettingsStrings() {
    return useContext(baseTextContext).public.pages.userSettings;
}

export function useWelcomePageStrings() {
    return useContext(baseTextContext).public.pages.welcomePage;
}

export function useWindowRegistrationWindowStrings() {
    return useContext(baseTextContext).public.pages.windowRegistrationWindow;
}


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
