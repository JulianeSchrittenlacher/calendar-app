import "../styles/Header.css"
import {useState} from "react";
import Modal from "./Modal.tsx";
import {NavLink, useLocation} from "react-router-dom";
import useUserStore from "../stores/useUserStore.ts";
import FamilyDetailForm from "./FamilyDetailForm.tsx";
import {Drawer, IconButton, List, ListItem, ListItemText, Typography} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

export default function Header() {

    const [modalOpen, setModalOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const currentUser = useUserStore(state => state.currentUser);
    const location = useLocation();


    const handleClick = () => {
        setModalOpen(true);
    }
    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const getButtonText = () => {
        if (location.pathname === '/my-family-page') {
            return "Familien Details";
        }
        return null;

    }

    const renderForm = () => {
        if (location.pathname === '/my-family-page') {
            return <FamilyDetailForm onClose={handleCloseModal}/>;
        }
        return null;
    };

    const toggleDrawer = (open: boolean) => () => {
        setDrawerOpen(open);
    };

    return (
        <>
            <div className="header-container">
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={toggleDrawer(true)}
                    sx={{
                        marginRight: 2,
                        fontSize: 70
                    }}
                >
                    <MenuIcon sx={{fontSize: 'inherit'}}/>
                </IconButton>
                <div className="app-header">
                    <h1>Familienkalender</h1>
                    <h2>Mit Liebe geplant, mit Freude gelebt</h2>
                    <h2>Termine für Herz und Seele</h2>
                </div>
                <div className="header-buttons">
                    <p>{currentUser && "Hallo " + currentUser.username + "!"}</p>
                    {location.pathname !== "/" && (
                        <button onClick={handleClick}>{getButtonText()}</button>
                    )}

                </div>
            </div>

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 200, // Breite des Menüs
                        boxSizing: 'border-box',
                    },
                }}
            >
                <List>
                    <ListItem>
                        <Typography variant="h6">Menu</Typography>
                    </ListItem>
                    <ListItem component={NavLink} to="/" onClick={toggleDrawer(false)}>
                        <ListItemText primary="Login/Logout" primaryTypographyProps={{style: {fontSize: '1.2rem'}}}/>
                    </ListItem>
                    {currentUser && (
                        <>
                            <ListItem component={NavLink} to="/my-family-page" onClick={toggleDrawer(false)}>
                                <ListItemText primary="Meine Familie"
                                              primaryTypographyProps={{style: {fontSize: '1.2rem'}}}/>
                            </ListItem>
                            <ListItem component={NavLink} to="/calendar" onClick={toggleDrawer(false)}>
                                <ListItemText primary="Kalenderansicht"
                                              primaryTypographyProps={{style: {fontSize: '1.2rem'}}}/>
                            </ListItem>
                        </>
                    )}
                </List>
            </Drawer>

            <Modal show={modalOpen} onClose={handleCloseModal}>
                {renderForm()}
            </Modal>
        </>
    );
}


