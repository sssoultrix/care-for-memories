import React, { useState } from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,
    IconButton // Добавлен импорт
} from '@mui/material';
import {
    Archive as ArchiveIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    LocationOn as LocationIcon,
    Add as AddIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import CemeteryDialog from './CemeteryDialog';

const Sidebar = () => {
    const [openDialog, setOpenDialog] = useState(false); // Добавляем состояние для диалога
    const [cemeteries, setCemeteries] = useState([]); // Состояние для списка кладбищ

    // Обработчик сохранения нового кладбища
    const handleSaveCemetery = (cemetery) => {
        setCemeteries([...cemeteries, cemetery]);
        // Здесь можно добавить логику сохранения в базу данных
        console.log('New cemetery:', cemetery);
    };

    return (
        <Box sx={{ width: 240, bgcolor: '#1A1A1A', height: '100vh', color: '#FFFFFF' }}>
            <Box sx={{ p: 2 }}>
                <Typography variant="h6">Care for Memories</Typography>
            </Box>

            <Box>
                <ListItem>
                    <ListItemIcon sx={{ color: '#FFFFFF' }}>
                        <LocationIcon />
                    </ListItemIcon>
                    <ListItemText primary="Кладбища" />
                </ListItem>

                <Button
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)} // Открываем диалог при клике
                    sx={{
                        color: '#FFFFFF',
                        width: '100%',
                        justifyContent: 'flex-start',
                        pl: 4,
                        '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                        },
                    }}
                >
                    Добавить кладбище
                </Button>

                {/* Список существующих кладбищ */}
                {cemeteries.map((cemetery, index) => (
                    <ListItem
                        key={index}
                        sx={{
                            pl: 4,
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                            },
                        }}
                        secondaryAction={
                            <IconButton
                                edge="end"
                                sx={{ color: '#FF4A4A' }}
                                onClick={() => {
                                    const newCemeteries = cemeteries.filter((_, i) => i !== index);
                                    setCemeteries(newCemeteries);
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        }
                    >
                        <ListItemIcon sx={{ color: '#FFFFFF', minWidth: 35 }}>
                            <LocationIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={cemetery.name}
                            secondary={`${cemetery.coordinates[0].toFixed(4)}, ${cemetery.coordinates[1].toFixed(4)}`}
                            secondaryTypographyProps={{ sx: { color: '#CCCCCC' } }}
                        />
                    </ListItem>
                ))}

                <List>
                    <ListItem button>
                        <ListItemIcon sx={{ color: '#FFFFFF' }}>
                            <ArchiveIcon />
                        </ListItemIcon>
                        <ListItemText primary="Архив" />
                    </ListItem>

                    <ListItem button>
                        <ListItemIcon sx={{ color: '#FFFFFF' }}>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Настройки" />
                    </ListItem>

                    <ListItem button>
                        <ListItemIcon sx={{ color: '#FFFFFF' }}>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Выйти" />
                    </ListItem>
                </List>
            </Box>

            {/* Диалог добавления кладбища */}
            <CemeteryDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onSave={handleSaveCemetery}
            />
        </Box>
    );
};

export default Sidebar;