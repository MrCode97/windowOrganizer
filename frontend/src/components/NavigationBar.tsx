import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemText, Typography, IconButton, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { LangBadge, useAppStrings } from './../contexts/text';

type LangKey = "en-US" | "de-DE";

interface NavigationBarProps {
    lang: LangKey;
    setLang: (arg0: LangKey) => void;
    drawerWidth: number;
    info: string;
    welcomePage: string;
    impressum: string;
    calendarsText: string;
    administration: string;
    search: string;
    login: string;
    registerUser: string;
    myCalendars: string;
    myWindows: string;
    registerCalendar: string;
    userSettings: string;
    selectedCalendar: any;
    user: any;
    showSearch: boolean;
    searchTerm: string;
    calendars: any[];
    setShowWelcome: (value: boolean) => void;
    setShowCalendar: (value: boolean) => void;
    setShowLogin: (value: boolean) => void;
    setShowRegistration: (value: boolean) => void;
    setShowRegistrationCalendar: (value: boolean) => void;
    setShowMyCalendars: (value: boolean) => void;
    setShowMyWindows: (value: boolean) => void;
    setShowUserSettings: (value: boolean) => void;
    setShowImpressum: (value: boolean) => void;
    setSearchTerm: (value: string) => void;
    setSelectedCalendar: (value: any) => void;
    setCalendarAdded: (value: boolean) => void;
    toggleSearchField: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
    lang,
    setLang,
    drawerWidth,
    info,
    user,
    showSearch,
    searchTerm,
    calendars,
    selectedCalendar,
    setShowWelcome,
    setShowCalendar,
    setShowLogin,
    setShowRegistration,
    setShowRegistrationCalendar,
    setShowMyCalendars,
    setShowMyWindows,
    setShowUserSettings,
    setShowImpressum,
    setSearchTerm,
    setSelectedCalendar,
    setCalendarAdded,
    toggleSearchField
}) => {

    function setAllFalse() {
        setShowWelcome(false);
        setShowCalendar(false);
        setShowLogin(false);
        setShowRegistration(false);
        setShowRegistrationCalendar(false);
        setShowMyCalendars(false);
        setShowMyWindows(false);
        setShowUserSettings(false);
        setShowImpressum(false);
        setSearchTerm('');
    }

    const langStrings = useAppStrings();
    const { welcomePage, impressum, calendarsText, administration, search, login, registerUser, myCalendars, myWindows, registerCalendar, userSettings } = langStrings;
    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    top: '64px',
                    backgroundColor: '#2D2923',
                    color: '#FFF4E0',
                    borderRight: '2px solid #D4AF37',
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <List>
                <ListItem>
                    <LangBadge lang={lang} setLang={setLang} />
                    {/*<LangFlag lang={lang} setLang={setLang} />*/}
                </ListItem>
            </List>
            
            <List>
                <ListItem>
                    <ListItemText>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            {info}
                        </Typography>
                    </ListItemText>
                </ListItem>
                <ListItemButton onClick={() => {setAllFalse(); setShowWelcome(true)}}>
                    <ListItemText primary={welcomePage} />
                </ListItemButton>
                <ListItemButton onClick={() => {setAllFalse(); setShowImpressum(true)}}>
                    <ListItemText primary={impressum} />
                </ListItemButton>
            </List>

            <List>
                <ListItem>
                    <ListItemText>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            {calendarsText}
                        </Typography>
                    </ListItemText>
                    <IconButton onClick={() => { setCalendarAdded(true); toggleSearchField(); }}>
                        <SearchIcon sx={{ color: '#FFF4E0' }} />
                    </IconButton>
                </ListItem>
                {selectedCalendar && !showSearch && (
                    <ListItem sx={{ border: '2px solid orange', borderRadius: '4px', padding: '8px' }}>
                        <ListItemButton onClick={() => setShowCalendar(true)}>
                            <ListItemText primary={selectedCalendar.name} />
                        </ListItemButton>
                    </ListItem>
                )}
            </List>

            {showSearch && (
                <>
                    <TextField
                        label={search}
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ margin: '0 10px', borderRadius: '5px', border: '1px solid #D4AF37' }}
                    />
                    <List>
                        {calendars
                            .filter((calendar) => calendar.name.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((calendar) => (
                                <ListItemButton onClick={() => {setAllFalse(); toggleSearchField(); setSelectedCalendar(calendar); setShowCalendar(true);}} key={calendar.name}>
                                    <ListItemText primary={calendar.name} />
                                </ListItemButton>
                            ))}
                    </List>
                </>
            )}

            <List>
                <ListItem>
                    <ListItemText>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            {administration}
                        </Typography>
                    </ListItemText>
                </ListItem>
                {!user && (
                    <>
                        <ListItemButton onClick={() => {setAllFalse(); setShowLogin(true)}}>
                            <ListItemText primary={login} />
                        </ListItemButton>
                        <ListItemButton onClick={() => {setAllFalse(); setShowRegistration(true)}}>
                            <ListItemText primary={registerUser} />
                        </ListItemButton>
                    </>
                )}
                {user && (
                    <>
                        <ListItemButton onClick={() => {setAllFalse(); setShowMyCalendars(true)}}>
                            <ListItemText primary={myCalendars} />
                        </ListItemButton>
                        <ListItemButton onClick={() => {setAllFalse(); setShowMyWindows(true)}}>
                            <ListItemText primary={myWindows} />
                        </ListItemButton>
                        <ListItemButton onClick={() => {setAllFalse(); setShowRegistrationCalendar(true)}}>
                            <ListItemText primary={registerCalendar} />
                        </ListItemButton>
                        <ListItemButton onClick={() => {setAllFalse(); setShowUserSettings(true)}}>
                            <ListItemText primary={userSettings} />
                        </ListItemButton>
                    </>
                )}
            </List>
        </Drawer>
    );
};

export default NavigationBar;
