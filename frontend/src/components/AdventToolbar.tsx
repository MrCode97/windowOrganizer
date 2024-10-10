import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useAppStrings } from './../contexts/text';
import Button from '@mui/material/Button';
import { AppBar } from '@mui/material/';
import { LangFlag } from './LangFlag';

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
            <Toolbar
                className="toolbar"
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
                <Typography variant="h6" noWrap>
                    {selectedCalendar ? selectedCalendar.name : welcome}
                </Typography>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {user && (
                        <>
                            <Typography variant="h6" noWrap sx={{ marginRight: '20px' }}>
                                {hello} {user}
                            </Typography>
                            <Button
                                sx={{ color: '#FFF4E0', marginRight: '20px' }}
                                onClick={() => {
                                    logout();
                                    setShowLogin(false);
                                }}
                            >
                                {logoutText}
                            </Button>
                        </>
                    )}
                    <LangFlag lang={lang} setLang={setLang} />
                </div>
            </Toolbar>
        </AppBar>
    );
}
