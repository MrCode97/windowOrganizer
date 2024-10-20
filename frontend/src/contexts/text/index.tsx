// src/contexts/text/index.tsx

import React, { createContext, useContext } from 'react';
import baseLangStrings from './en-US.json';

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

function isObject(item: any): boolean {
    return item !== null && typeof item === 'object' && !Array.isArray(item);
}

function deepMergeWithMap(target: any, source: any, visited = new Map<any, any>()) {
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) {
                    target[key] = {};
                }
                // Check if the source object has already been visited
                if (!visited.has(source[key])) {
                    visited.set(source[key], {});
                    deepMergeWithMap(target[key], source[key], visited);
                } else {
                    target[key] = visited.get(source[key]);
                }
            } else {
                target[key] = source[key];
            }
        }
    }
    return target;
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
            var varsStrings = {} as any;
            try {
                 const vars = await fetch(`/lang/vars.json`);
                 varsStrings = await vars.json();
            } catch (error) {
                console.log("error loading lang/vars.json " + error);
            }
            try {
                const jsonStrings = await import(`./${props.lang}.json`) as JsonLocalizedStrings;
                if (jsonStrings.public) {
                    var completeData = jsonStrings;
                    if (varsStrings.public) {
                        completeData = deepMergeWithMap(jsonStrings, varsStrings);
                    }
                    setLangStrings(completeData);
                    console.log("lang changed to " + props.lang);
                } else {
                    console.log("empty lang-file: " + props.lang);
                }
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
