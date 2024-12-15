import React, { useState } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    TablePagination,
    TextField,
    InputAdornment,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    TableSortLabel,
    Grid,
    Tooltip
} from '@mui/material';
import {
    Search as SearchIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    FileDownload as ExportIcon
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import * as XLSX from 'xlsx';

// Стили для текстовых полей
const textFieldStyle = {
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
    '& .MuiInputAdornment-root': {
        color: '#666666',
    },
};

// Функция для безопасного форматирования даты
const formatDate = (date) => {
    if (!date) return '';
    try {
        return format(new Date(date), 'dd.MM.yyyy');
    } catch (error) {
        return '';
    }
};

// Компонент диалогового окна для добавления/редактирования записи
const RecordDialog = ({ open, onClose, record, setRecord, onSave, title }) => {
    const initialRecord = record || {
        name: '',
        birthDate: null,
        deathDate: null,
        burialLocation: '',
        burialNumber: '',
        responsible: '',
        additionalInfo: ''
    };

    const handleChange = (field) => (event) => {
        setRecord({
            ...record,
            [field]: event.target.value
        });
    };

    const handleDateChange = (field) => (date) => {
        setRecord({
            ...record,
            [field]: date
        });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    bgcolor: '#1A1A1A',
                    color: '#FFFFFF',
                    minWidth: '500px'
                }
            }}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <TextField
                        label="ФИО"
                        value={initialRecord.name || ''}
                        onChange={handleChange('name')}
                        sx={textFieldStyle}
                    />

                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                        <DesktopDatePicker
                            label="Дата рождения"
                            value={initialRecord.birthDate}
                            onChange={handleDateChange('birthDate')}
                            renderInput={(params) => <TextField {...params} sx={textFieldStyle} />}
                        />

                        <DesktopDatePicker
                            label="Дата смерти"
                            value={initialRecord.deathDate}
                            onChange={handleDateChange('deathDate')}
                            renderInput={(params) => <TextField {...params} sx={textFieldStyle} />}
                        />
                    </LocalizationProvider>

                    <TextField
                        label="Место захоронения"
                        value={initialRecord.burialLocation || ''}
                        onChange={handleChange('burialLocation')}
                        sx={textFieldStyle}
                    />

                    <TextField
                        label="Номер захоронения"
                        value={initialRecord.burialNumber || ''}
                        onChange={handleChange('burialNumber')}
                        sx={textFieldStyle}
                    />

                    <TextField
                        label="Ответственное лицо"
                        value={initialRecord.responsible || ''}
                        onChange={handleChange('responsible')}
                        sx={textFieldStyle}
                    />

                    <TextField
                        label="Дополнительная информация"
                        value={initialRecord.additionalInfo || ''}
                        onChange={handleChange('additionalInfo')}
                        multiline
                        rows={4}
                        sx={textFieldStyle}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} sx={{ color: '#CCCCCC' }}>
                    Отмена
                </Button>
                <Button
                    onClick={() => onSave(initialRecord)}
                    sx={{
                        color: '#4A9EFF',
                        '&:hover': { bgcolor: 'rgba(74, 158, 255, 0.1)' }
                    }}
                >
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// Основной компонент архива
const Archive = () => {
    // Состояния
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDateStart, setFilterDateStart] = useState(null);
    const [filterDateEnd, setFilterDateEnd] = useState(null);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [newRecord, setNewRecord] = useState({
        name: '',
        birthDate: null,
        deathDate: null,
        burialLocation: '',
        burialNumber: '',
        responsible: '',
        additionalInfo: ''
    });
    const [orderBy, setOrderBy] = useState('name');
    const [order, setOrder] = useState('asc');

    // Обработчики сортировки
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Фильтрация данных
    const filteredData = data
        .filter(record => {
            const matchesSearch = Object.values(record)
                .join(' ')
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

            let matchesDateRange = true;
            if (filterDateStart || filterDateEnd) {
                try {
                    const deathDate = record.deathDate ? new Date(record.deathDate) : null;
                    matchesDateRange = (!filterDateStart || !deathDate || deathDate >= filterDateStart) &&
                        (!filterDateEnd || !deathDate || deathDate <= filterDateEnd);
                } catch (error) {
                    matchesDateRange = false;
                }
            }

            return matchesSearch && matchesDateRange;
        })
        .sort((a, b) => {
            const isAsc = order === 'asc';
            if (orderBy === 'deathDate' || orderBy === 'birthDate') {
                try {
                    const dateA = a[orderBy] ? new Date(a[orderBy]) : null;
                    const dateB = b[orderBy] ? new Date(b[orderBy]) : null;

                    if (!dateA && !dateB) return 0;
                    if (!dateA) return isAsc ? 1 : -1;
                    if (!dateB) return isAsc ? -1 : 1;

                    return isAsc ? dateA - dateB : dateB - dateA;
                } catch (error) {
                    return 0;
                }
            }
            return isAsc ?
                (a[orderBy] || '').localeCompare(b[orderBy] || '') :
                (b[orderBy] || '').localeCompare(a[orderBy] || '');
        });

    // Обработчики страницы
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Обработчики CRUD операций
    const handleAdd = (record) => {
        setData([...data, { ...record, id: Date.now() }]);
        setOpenAddDialog(false);
        setNewRecord({
            name: '',
            birthDate: null,
            deathDate: null,
            burialLocation: '',
            burialNumber: '',
            responsible: '',
            additionalInfo: ''
        });
    };

    const handleEdit = (record) => {
        setData(data.map(item => item.id === record.id ? record : item));
        setOpenEditDialog(false);
        setSelectedRecord(null);
    };

    const handleDelete = () => {
        setData(data.filter(item => item.id !== selectedRecord.id));
        setOpenDeleteDialog(false);
        setSelectedRecord(null);
    };

    // Экспорт в Excel
    const handleExport = () => {
        const ws = XLSX.utils.json_to_sheet(filteredData.map(record => ({
            'ФИО': record.name || '',
            'Дата рождения': formatDate(record.birthDate),
            'Дата смерти': formatDate(record.deathDate),
            'Место захоронения': record.burialLocation || '',
            'Номер захоронения': record.burialNumber || '',
            'Ответственное лицо': record.responsible || '',
            'Дополнительная информация': record.additionalInfo || ''
        })));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Архив');
        XLSX.writeFile(wb, 'archive.xlsx');
    };

    return (
        <Box sx={{ p: 3, bgcolor: '#121212', minHeight: '100vh', color: '#FFFFFF' }}>
            <Typography variant="h4" gutterBottom>
                Архив захоронений
            </Typography>

            {/* Панель инструментов */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Поиск"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={textFieldStyle}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                            <DesktopDatePicker
                                label="Дата смерти от"
                                value={filterDateStart}
                                onChange={setFilterDateStart}
                                renderInput={(params) => <TextField {...params} sx={textFieldStyle} />}
                            />

                            <DesktopDatePicker
                                label="Дата смерти до"
                                value={filterDateEnd}
                                onChange={setFilterDateEnd}
                                renderInput={(params) => <TextField {...params} sx={textFieldStyle} />}
                            />
                        </LocalizationProvider>
                    </Box>
                </Grid>

                <Grid item xs={12} md={2}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Добавить запись">
                            <Button
                                variant="contained"
                                onClick={() => setOpenAddDialog(true)}
                                sx={{
                                    bgcolor: '#4A9EFF',
                                    '&:hover': { bgcolor: '#357ABD' }
                                }}
                            >
                                <AddIcon />
                            </Button>
                        </Tooltip>

                        <Tooltip title="Экспорт в Excel">
                            <Button
                                variant="contained"
                                onClick={handleExport}
                                sx={{
                                    bgcolor: '#4CAF50',
                                    '&:hover': { bgcolor: '#388E3C' }
                                }}
                            >
                                <ExportIcon />
                            </Button>
                        </Tooltip>
                    </Box>
                </Grid>
            </Grid>

            {/* Таблица */}
            <TableContainer component={Paper} sx={{ bgcolor: '#1A1A1A' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: '#CCCCCC' }}>
                                <TableSortLabel
                                    active={orderBy === 'name'}
                                    direction={orderBy === 'name' ? order : 'asc'}
                                    onClick={() => handleRequestSort('name')}
                                    sx={{
                                        '& .MuiTableSortLabel-icon': {
                                            color: '#666666 !important',
                                        },
                                    }}
                                >
                                    ФИО
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ color: '#CCCCCC' }}>
                                <TableSortLabel
                                    active={orderBy === 'birthDate'}
                                    direction={orderBy === 'birthDate' ? order : 'asc'}
                                    onClick={() => handleRequestSort('birthDate')}
                                    sx={{
                                        '& .MuiTableSortLabel-icon': {
                                            color: '#666666 !important',
                                        },
                                    }}
                                >
                                    Дата рождения
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ color: '#CCCCCC' }}>
                                <TableSortLabel
                                    active={orderBy === 'deathDate'}
                                    direction={orderBy === 'deathDate' ? order : 'asc'}
                                    onClick={() => handleRequestSort('deathDate')}
                                    sx={{
                                        '& .MuiTableSortLabel-icon': {
                                            color: '#666666 !important',
                                        },
                                    }}
                                >
                                    Дата смерти
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ color: '#CCCCCC' }}>
                                <TableSortLabel
                                    active={orderBy === 'burialLocation'}
                                    direction={orderBy === 'burialLocation' ? order : 'asc'}
                                    onClick={() => handleRequestSort('burialLocation')}
                                    sx={{
                                        '& .MuiTableSortLabel-icon': {
                                            color: '#666666 !important',
                                        },
                                    }}
                                >
                                    Место захоронения
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ color: '#CCCCCC' }}>
                                <TableSortLabel
                                    active={orderBy === 'burialNumber'}
                                    direction={orderBy === 'burialNumber' ? order : 'asc'}
                                    onClick={() => handleRequestSort('burialNumber')}
                                    sx={{
                                        '& .MuiTableSortLabel-icon': {
                                            color: '#666666 !important',
                                        },
                                    }}
                                >
                                    Номер захоронения
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ color: '#CCCCCC' }}>
                                <TableSortLabel
                                    active={orderBy === 'responsible'}
                                    direction={orderBy === 'responsible' ? order : 'asc'}
                                    onClick={() => handleRequestSort('responsible')}
                                    sx={{
                                        '& .MuiTableSortLabel-icon': {
                                            color: '#666666 !important',
                                        },
                                    }}
                                >
                                    Ответственное лицо
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ color: '#CCCCCC' }}>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell sx={{ color: '#FFFFFF' }}>{record.name}</TableCell>
                                    <TableCell sx={{ color: '#FFFFFF' }}>
                                        {formatDate(record.birthDate)}
                                    </TableCell>
                                    <TableCell sx={{ color: '#FFFFFF' }}>
                                        {formatDate(record.deathDate)}
                                    </TableCell>
                                    <TableCell sx={{ color: '#FFFFFF' }}>{record.burialLocation}</TableCell>
                                    <TableCell sx={{ color: '#FFFFFF' }}>{record.burialNumber}</TableCell>
                                    <TableCell sx={{ color: '#FFFFFF' }}>{record.responsible}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => {
                                                setSelectedRecord(record);
                                                setOpenEditDialog(true);
                                            }}
                                            sx={{ color: '#4A9EFF' }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => {
                                                setSelectedRecord(record);
                                                setOpenDeleteDialog(true);
                                            }}
                                            sx={{ color: '#ff4444' }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={filteredData.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                    color: '#CCCCCC',
                    '& .MuiSelect-icon': {
                        color: '#CCCCCC'
                    }
                }}
            />

            <RecordDialog
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                record={newRecord}
                setRecord={setNewRecord}
                onSave={handleAdd}
                title="Добавление записи"
            />

            <RecordDialog
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
                record={selectedRecord}
                setRecord={setSelectedRecord}
                onSave={handleEdit}
                title="Редактирование записи"
            />

            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                PaperProps={{
                    sx: {
                        bgcolor: '#1A1A1A',
                        color: '#FFFFFF'
                    }
                }}
            >
                <DialogTitle>Подтверждение удаления</DialogTitle>
                <DialogContent>
                    <Typography>
                        Вы действительно хотите удалить запись {selectedRecord?.name}?
                        Это действие нельзя будет отменить.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} sx={{ color: '#CCCCCC' }}>
                        Отмена
                    </Button>
                    <Button
                        onClick={handleDelete}
                        sx={{
                            color: '#ff4444',
                            '&:hover': { bgcolor: 'rgba(255, 68, 68, 0.1)' }
                        }}
                    >
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Archive;