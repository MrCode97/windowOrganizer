import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { LangBadge, useAppStrings } from './../contexts/text';
import Button from '@mui/material/Button';
import { AppBar } from '@mui/material/';

type LangKey = "en-US" | "de-DE";

type AdventToolbarProps = {
    selectedCalendar: { name: React.ReactNode } | null;
    user: React.ReactNode | null;
    logout: () => void;
    setShowLogin: (arg0: boolean) => void;
    lang: LangKey;
    setLang: (arg0: LangKey) => void;
};

export default function AdventToolbar({
    selectedCalendar,
    user,
    logout,
    setShowLogin,
    lang,
    setLang
}: AdventToolbarProps) {
    const langStrings = useAppStrings();
    const { welcome, hello, logoutText } = langStrings;

    return (
        <AppBar position="fixed">
        <Toolbar className="toolbar">
            <Typography variant="h6" noWrap>
                {selectedCalendar ? selectedCalendar.name : welcome}
            </Typography>
            {user && (
                <Typography variant="h6" noWrap sx={{ marginLeft: 'auto' }}>
                    {hello} {user}
                </Typography>
            )}
            {user && (
                <Button
                    sx={{ paddingLeft: '20px', color: '#FFF4E0' }}
                    onClick={() => {
                        logout();
                        setShowLogin(false);
                    }}
                >
                    {logoutText}
                </Button>
            )}
            <LangBadge lang={lang} setLang={setLang} />
        </Toolbar>
        </AppBar>
    );
}
