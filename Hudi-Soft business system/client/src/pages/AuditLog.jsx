import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuditLogs } from '../store/slices/auditSlice';
import { Search, Filter, ShieldCheck, User, Clock, Loader2 } from 'lucide-react';
import Button from '../components/Button';

const AuditLog = () => {
    const dispatch = useDispatch();
    const { logs, loading } = useSelector(state => state.audit);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchAuditLogs());
    }, [dispatch]);

    const filteredLogs = logs.filter(log =>
        log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getActionStyle = (action) => {
        switch (action) {
            case 'CREATE': return 'bg-green-100 text-green-600';
            case 'UPDATE': return 'bg-amber-100 text-amber-600';
            case 'DELETE': return 'bg-red-100 text-red-600';
            case 'SALE': return 'bg-primary-100 text-primary-600';
            default: return 'bg-secondary-100 text-secondary-600';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h3 className="text-2xl font-bold text-secondary-900 dark:text-white">Audit Trail</h3>
                <p className="text-secondary-500 text-sm">Monitor all system activities and user actions.</p>
            </div>

            <div className="card overflow-hidden">
                <div className="p-6 border-b border-secondary-100 dark:border-secondary-800 flex justify-between items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search logs (action, user, or details)..."
                            className="w-full pl-10 pr-4 py-2 border border-secondary-200 dark:border-secondary-800 rounded-xl outline-none text-sm bg-white dark:bg-secondary-900"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading && logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-secondary-400">
                        <Loader2 className="animate-spin mb-4" size={40} />
                        <p className="font-medium">Fetching activity logs...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-secondary-50 dark:bg-secondary-800 text-secondary-500 text-xs font-bold uppercase tracking-wider">
                                    <th className="px-6 py-4">Timestamp</th>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Action</th>
                                    <th className="px-6 py-4">Module</th>
                                    <th className="px-6 py-4">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800">
                                {filteredLogs.length > 0 ? (
                                    filteredLogs.map((log) => (
                                        <tr key={log._id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-secondary-500 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Clock size={14} />
                                                    {new Date(log.createdAt).toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center text-secondary-600 font-bold text-xs uppercase">
                                                        {(log.user?.name || 'S').substring(0, 1)}
                                                    </div>
                                                    <span className="text-sm font-bold text-secondary-900 dark:text-white">
                                                        {log.user?.name || 'System'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getActionStyle(log.action)}`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-secondary-600">
                                                {log.module}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-secondary-500 max-w-xs truncate">
                                                {log.details}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center text-secondary-400">
                                            No logs matching your search criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuditLog;
