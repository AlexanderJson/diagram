import { Icons } from '../icons/Icons.jsx';

export const NODE_TYPES = [
    {
        category: 'Compute',
        items: [
            { type: 'server', label: 'Server', icon: Icons.Server, colorClass: 'node-blue' },
            { type: 'microservice', label: 'Microservice', icon: Icons.Cpu, colorClass: 'node-indigo' },
            { type: 'serverless', label: 'Serverless', icon: Icons.Zap, colorClass: 'node-yellow' },
        ]
    },
    {
        category: 'Database & Cache',
        items: [
            { type: 'sqldb', label: 'SQL DB', icon: Icons.Database, colorClass: 'node-green' },
            { type: 'nosqldb', label: 'NoSQL DB', icon: Icons.Layers, colorClass: 'node-emerald' },
            { type: 'dbtable', label: 'DB Tabell', icon: Icons.Table, colorClass: 'node-white-indigo' },
            { type: 'cache', label: 'Cache', icon: Icons.Zap, colorClass: 'node-teal' },
        ]
    },
    {
        category: 'Network & Storage',
        items: [
            { type: 'loadbalancer', label: 'Load Balancer', icon: Icons.Network, colorClass: 'node-orange' },
            { type: 'apigateway', label: 'API Gateway', icon: Icons.Cloud, colorClass: 'node-sky' },
            { type: 'objectstore', label: 'Object Store', icon: Icons.Box, colorClass: 'node-amber' },
        ]
    },
    {
        category: 'External',
        items: [
            { type: 'client', label: 'Client App', icon: Icons.MonitorSmartphone, colorClass: 'node-slate' },
            { type: 'users', label: 'Users', icon: Icons.Users, colorClass: 'node-slate' },
        ]
    },
    {
        category: 'Generell',
        items: [
            { type: 'custom', label: 'Egen Modul', icon: Icons.Box, colorClass: 'node-white-slate' },
            { type: 'note', label: 'Anteckning', icon: Icons.FileText, colorClass: 'node-note' },
        ]
    },
    {
        category: 'UML / Klasser',
        items: [
            { type: 'classnode', label: 'Klass', icon: Icons.Code, colorClass: 'node-white-purple' },
            { type: 'interface', label: 'Interface', icon: Icons.Code, colorClass: 'node-white-pink' }
        ]
    },
    {
        category: 'Gruppering & Områden',
        items: [
            { type: 'group', label: 'Grupp / Område', icon: Icons.SquareDashed, colorClass: 'node-group' }
        ]
    }
];

// Helper method analogous to a factory or lookup method in a Java class.
export const getNodeConfig = (type) => {
    for (const category of NODE_TYPES) {
        for (const item of category.items) {
            if (item.type === type) return item;
        }
    }
    // Fallbacks
    if (type === 'note') return { type: 'note', label: 'Anteckning', icon: Icons.FileText, colorClass: 'node-note' };
    if (type === 'group') return { type: 'group', label: 'Grupp', icon: Icons.SquareDashed, colorClass: 'node-group' };
    return { type: 'custom', label: 'Egen Modul', icon: Icons.Box, colorClass: 'node-white-slate' };
};
