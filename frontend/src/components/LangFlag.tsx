import React from 'react';

import CHFlagIcon from './../assets/langIcons/ch.svg';
import USFlagIcon from './../assets/langIcons/us.svg';

type LangKey = "en-US" | "de-DE";

export function LangFlag(props: { lang: LangKey, setLang: React.Dispatch<React.SetStateAction<any>> }) {

    return (
        <div id="lang-badge" style={{ display: 'flex', alignItems: 'center' }}>
            <img
                src={USFlagIcon}
                alt="US Flag"
                onClick={() => props.setLang("en-US")}
                style={{
                    width: '30px',
                    height: '20px',
                    margin: '0 5px',
                    cursor: 'pointer',
                    border: props.lang === "en-US" ? '2px solid #D4AF37' : 'none'
                }}
            />
            <img
                src={CHFlagIcon}
                alt="CH Flag"
                onClick={() => props.setLang("de-DE")}
                style={{
                    width: '30px',
                    height: '20px',
                    margin: '0 5px',
                    cursor: 'pointer',
                    border: props.lang === "de-DE" ? '2px solid #D4AF37' : 'none'
                }}
            />
        </div>
    );
}