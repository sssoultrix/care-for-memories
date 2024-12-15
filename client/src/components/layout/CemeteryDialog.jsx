import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
} from '@mui/material';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

const CemeteryDialog = ({ open, onClose, onSave }) => {
    const [cemetery, setCemetery] = React.useState({
        name: '',
        coordinates: null
    });

    const handleMapClick = (e) => {
        const coords = e.get('coords');
        setCemetery({ ...cemetery, coordinates: coords });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: '#1A1A1A',
                    color: '#FFFFFF'
                }
            }}
        >
            <DialogTitle>Добавить кладбище</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <TextField
                        label="Название кладбища"
                        value={cemetery.name}
                        onChange={(e) => setCemetery({ ...cemetery, name: e.target.value })}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: '#FFFFFF',
                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                            },
                            '& .MuiInputLabel-root': { color: '#CCCCCC' },
                        }}
                    />

                    <Box sx={{ height: '400px', width: '100%', mt: 2 }}>
                        <YMaps>
                            <Map
                                defaultState={{
                                    center: [55.75, 37.57],
                                    zoom: 9
                                }}
                                width="100%"
                                height="100%"
                                onClick={handleMapClick}
                            >
                                {cemetery.coordinates && (
                                    <Placemark geometry={cemetery.coordinates} />
                                )}
                            </Map>
                        </YMaps>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} sx={{ color: '#CCCCCC' }}>
                    Отмена
                </Button>
                <Button
                    onClick={() => {
                        onSave(cemetery);
                        setCemetery({ name: '', coordinates: null });
                        onClose();
                    }}
                    disabled={!cemetery.name || !cemetery.coordinates}
                    sx={{ color: '#4A9EFF' }}
                >
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CemeteryDialog;