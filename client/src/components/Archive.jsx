// src/components/Archive.jsx
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
    InputAdornment
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const Archive = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');

    // Пример данных (в реальном приложении будут загружаться с сервера)
    const archiveData = [
        {
            id: 1,
            fullName: 'Иванов Иван Иванович',
            birthDate: '15.03.1945',
            deathDate: '22.06.2023',
            burialLocation: 'Участок 3, Ряд 5, Место 12',
            burialNumber: 'A-3512',
            responsible: {
                name: 'Иванова Мария Петровна',
                contact: '+7 (999) 123-45-67'
            },
            additionalInfo: 'Ветеран ВОВ'
        },
        // Добавьте больше записей по необходимости
    ];

    // Фильтрация данных по поисковому запросу
    const filteredData = archiveData.filter(record =>
        record.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.burialNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, color: '#FFFFFF' }}>
                Архив захоронений
            </Typography>

            {/* Поиск */}
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Поиск по ФИО или номеру захоронения..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                    mb: 3,
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
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ color: '#666666' }} />
                        </InputAdornment>
                    ),
                }}
            />

            {/* Таблица */}
            <TableContainer
                component={Paper}
                sx={{
                    bgcolor: '#1A1A1A',
                    '& .MuiTableCell-root': {
                        borderColor: 'rgba(255, 255, 255, 0.05)'
                    }
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: '#FFFFFF' }}>ФИО</TableCell>
                            <TableCell sx={{ color: '#FFFFFF' }}>Дата рождения</TableCell>
                            <TableCell sx={{ color: '#FFFFFF' }}>Дата смерти</TableCell>
                            <TableCell sx={{ color: '#FFFFFF' }}>Место захоронения</TableCell>
                            <TableCell sx={{ color: '#FFFFFF' }}>Номер захоронения</TableCell>
                            <TableCell sx={{ color: '#FFFFFF' }}>Ответственное лицо</TableCell>
                            <TableCell sx={{ color: '#FFFFFF' }}>Доп. информация</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((record) => (
                                <TableRow
                                    key={record.id}
                                    sx={{
                                        '&:hover': {
                                            bgcolor: 'rgba(255, 255, 255, 0.03)'
                                        }
                                    }}
                                >
                                    <TableCell sx={{ color: '#CCCCCC' }}>{record.fullName}</TableCell>
                                    <TableCell sx={{ color: '#CCCCCC' }}>{record.birthDate}</TableCell>
                                    <TableCell sx={{ color: '#CCCCCC' }}>{record.deathDate}</TableCell>
                                    <TableCell sx={{ color: '#CCCCCC' }}>{record.burialLocation}</TableCell>
                                    <TableCell sx={{ color: '#CCCCCC' }}>{record.burialNumber}</TableCell>
                                    <TableCell sx={{ color: '#CCCCCC' }}>
                                        {record.responsible.name}<br />
                                        {record.responsible.contact}
                                    </TableCell>
                                    <TableCell sx={{ color: '#CCCCCC' }}>{record.additionalInfo}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Пагинация */}
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
        </Box>
    );
};

export default Archive;