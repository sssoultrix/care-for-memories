import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
    Paper,
    Collapse,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    DialogContentText,
    TextField
} from '@mui/material';
import {
    AccountBalance as CemeteryIcon,
    Archive as ArchiveIcon,
    Settings as SettingsIcon,
    ExitToApp as LogoutIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Add as AddIcon,
    Place as PlaceIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';

const Sidebar = () => {
    const [openCemeteries, setOpenCemeteries] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedCemetery, setSelectedCemetery] = useState(null);
    const [cemeteryList, setCemeteryList] = useState([
        { name: "Кладбище 1", id: 1 },
        { name: "Кладбище 2", id: 2 },
    ]);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [newCemeteryName, setNewCemeteryName] = useState('');

    const handleCemeteriesClick = () => {
        setOpenCemeteries(!openCemeteries);
    };

    const handleDeleteClick = (cemetery, event) => {
        event.stopPropagation();
        setSelectedCemetery(cemetery);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedCemetery) {
            setCemeteryList(prevList =>
                prevList.filter(cemetery => cemetery.id !== selectedCemetery.id)
            );
            console.log(`Кладбище "${selectedCemetery.name}" удалено`);
        }
        setDeleteDialogOpen(false);
        setSelectedCemetery(null);
    };

    const handleAddClick = () => {
        setOpenAddDialog(true);
    };

    const handleAddConfirm = () => {
        if (newCemeteryName.trim()) {
            const newCemetery = {
                id: Date.now(),
                name: newCemeteryName.trim()
            };

            setCemeteryList(prevList => [...prevList, newCemetery]);
            setNewCemeteryName('');
            setOpenAddDialog(false);
        }
    };

    return (
        <>
            <Paper
                elevation={0}
                sx={{
                    width: 280,
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bgcolor: '#0A0A0A',
                    borderRight: '1px solid',
                    borderColor: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    overflowY: 'auto'
                }}
            >
                {/* Шапка */}
                <Box
                    sx={{
                        p: 3,
                        background: 'linear-gradient(45deg, #111111 30%, #1A1A1A 90%)',
                        boxShadow: '0 3px 5px 2px rgba(0, 0, 0, 0.3)'
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 'bold',
                            letterSpacing: '0.5px',
                            textAlign: 'center',
                            color: '#FFFFFF'
                        }}
                    >
                        Care for Memories
                    </Typography>
                </Box>

                {/* Основное меню */}
                <List sx={{ px: 2, mt: 4 }}>
                    {/* Кладбища с выпадающим списком */}
                    <ListItem
                        button
                        onClick={handleCemeteriesClick}
                        sx={{
                            py: 2,
                            borderRadius: 2,
                            mb: openCemeteries ? 1 : 2,
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.03)',
                                '& .MuiListItemIcon-root': {
                                    color: '#4A9EFF',
                                },
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: '#666666' }}>
                            <CemeteryIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Кладбища"
                            primaryTypographyProps={{
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                color: '#CCCCCC'
                            }}
                        />
                        {openCemeteries ? <ExpandLessIcon sx={{ color: '#666666' }} /> : <ExpandMoreIcon sx={{ color: '#666666' }} />}
                    </ListItem>

                    {/* Выпадающий список кладбищ */}
                    <Collapse in={openCemeteries} timeout="auto">
                        <List component="div" disablePadding>
                            <ListItem
                                button
                                onClick={handleAddClick}
                                sx={{
                                    pl: 4,
                                    py: 1.5,
                                    borderRadius: 2,
                                    mb: 1,
                                    bgcolor: 'rgba(74, 158, 255, 0.1)',
                                    '&:hover': {
                                        bgcolor: 'rgba(74, 158, 255, 0.2)',
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ color: '#4A9EFF', minWidth: '35px' }}>
                                    <AddIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Добавить кладбище"
                                    primaryTypographyProps={{
                                        fontSize: '0.9rem',
                                        color: '#4A9EFF'
                                    }}
                                />
                            </ListItem>

                            {cemeteryList.map((cemetery) => (
                                <ListItem
                                    button
                                    key={cemetery.id}
                                    sx={{
                                        pl: 4,
                                        py: 1.5,
                                        borderRadius: 2,
                                        mb: 1,
                                        '&:hover': {
                                            bgcolor: 'rgba(255, 255, 255, 0.03)',
                                        },
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                                        <ListItemIcon sx={{ color: '#666666', minWidth: '35px' }}>
                                            <PlaceIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={cemetery.name}
                                            primaryTypographyProps={{
                                                fontSize: '0.9rem',
                                                color: '#CCCCCC'
                                            }}
                                        />
                                    </Box>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => handleDeleteClick(cemetery, e)}
                                        sx={{
                                            color: '#666666',
                                            '&:hover': {
                                                color: '#ff4444',
                                                bgcolor: 'rgba(255, 68, 68, 0.1)'
                                            }
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>

                    {/* Архив */}
                    <ListItem
                        button
                        component={Link}
                        to="/archive"
                        sx={{
                            py: 2,
                            borderRadius: 2,
                            mb: 2,
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.03)',
                                '& .MuiListItemIcon-root': {
                                    color: '#4A9EFF',
                                },
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: '#666666' }}>
                            <ArchiveIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Архив"
                            primaryTypographyProps={{
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                color: '#CCCCCC'
                            }}
                        />
                    </ListItem>

                    {/* Настройки */}
                    <ListItem
                        button
                        sx={{
                            py: 2,
                            borderRadius: 2,
                            mb: 2,
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.03)',
                                '& .MuiListItemIcon-root': {
                                    color: '#4A9EFF',
                                },
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: '#666666' }}>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Настройки"
                            primaryTypographyProps={{
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                color: '#CCCCCC'
                            }}
                        />
                    </ListItem>
                </List>

                {/* Разделитель */}
                <Divider sx={{ mx: 2, bgcolor: 'rgba(255, 255, 255, 0.05)', my: 2 }} />

                {/* Нижнее меню */}
                <List sx={{ px: 2, mt: 'auto', mb: 2 }}>
                    <ListItem
                        button
                        sx={{
                            py: 2,
                            borderRadius: 2,
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.03)',
                                '& .MuiListItemIcon-root': {
                                    color: '#4A9EFF',
                                },
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: '#666666' }}>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Выйти"
                            primaryTypographyProps={{
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                color: '#CCCCCC'
                            }}
                        />
                    </ListItem>
                </List>
            </Paper>

            {/* Диалог подтверждения удаления */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                PaperProps={{
                    sx: {
                        bgcolor: '#1A1A1A',
                        color: '#CCCCCC',
                        minWidth: '320px'
                    }
                }}
            >
                <DialogTitle sx={{ color: '#FFFFFF' }}>
                    Подтверждение удаления
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: '#CCCCCC' }}>
                        Вы действительно хотите удалить кладбище "{selectedCemetery?.name}"?
                        Это действие нельзя будет отменить.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        sx={{
                            color: '#CCCCCC',
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.05)'
                            }
                        }}
                    >
                        Отмена
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        sx={{
                            bgcolor: 'rgba(255, 68, 68, 0.1)',
                            color: '#ff4444',
                            '&:hover': {
                                bgcolor: 'rgba(255, 68, 68, 0.2)'
                            }
                        }}
                    >
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Диалог добавления нового кладбища */}
            <Dialog
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                PaperProps={{
                    sx: {
                        bgcolor: '#1A1A1A',
                        color: '#CCCCCC',
                        minWidth: '320px'
                    }
                }}
            >
                <DialogTitle sx={{ color: '#FFFFFF' }}>
                    Добавление нового кладбища
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Название кладбища"
                        type="text"
                        fullWidth
                        value={newCemeteryName}
                        onChange={(e) => setNewCemeteryName(e.target.value)}
                        sx={{
                            mt: 2,
                            '& .MuiOutlinedInput-root': {
                                color: '#FFFFFF',
                                '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.4)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#4A9EFF',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: '#CCCCCC',
                                '&.Mui-focused': {
                                    color: '#4A9EFF',
                                },
                            },
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={() => {
                            setOpenAddDialog(false);
                            setNewCemeteryName('');
                        }}
                        sx={{
                            color: '#CCCCCC',
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.05)'
                            }
                        }}
                    >
                        Отмена
                    </Button>
                    <Button
                        onClick={handleAddConfirm}
                        disabled={!newCemeteryName.trim()}
                        sx={{
                            bgcolor: 'rgba(74, 158, 255, 0.1)',
                            color: '#4A9EFF',
                            '&:hover': {
                                bgcolor: 'rgba(74, 158, 255, 0.2)'
                            },
                            '&.Mui-disabled': {
                                color: 'rgba(74, 158, 255, 0.5)',
                            }
                        }}
                    >
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Sidebar;