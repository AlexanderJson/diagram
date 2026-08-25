import { Icons } from '../icons/Icons.jsx';

const item = (type, label, icon, colorClass, description = '', extra = {}) => ({
    type,
    label,
    icon,
    colorClass,
    defaults: { description, ...extra },
});

export const NODE_TYPES = [
    { category: 'Compute', items: [
        item('server', 'Server', Icons.Server, 'node-blue', 'Kör en applikation eller tjänst.'),
        item('microservice', 'Microservice', Icons.Cpu, 'node-indigo', 'En självständig tjänst med ett tydligt ansvar.'),
        item('serverless', 'Serverless', Icons.Zap, 'node-yellow', 'Kod som körs vid en händelse eller ett anrop.'),
    ] },
    { category: 'Database & Cache', items: [
        item('sqldb', 'SQL DB', Icons.Database, 'node-green', 'Relationsdatabas.'),
        item('nosqldb', 'NoSQL DB', Icons.Layers, 'node-emerald', 'Dokument-, nyckelvärdes- eller grafdatabas.'),
        item('dbtable', 'DB Tabell', Icons.Table, 'node-white-indigo', 'En tabell med kolumner.', { fields: [] }),
        item('cache', 'Cache', Icons.Zap, 'node-teal', 'Snabb, tillfällig lagring.'),
    ] },
    { category: 'API & Delivery', items: [
        item('endpoint', 'Endpoint', Icons.Network, 'node-sky', 'En URL som tar emot ett API-anrop.', {
            httpMethod: 'GET',
            route: '/resource',
            requestType: '',
            responseType: '',
            successStatus: '200',
            requestModelId: null,
            responseModelId: null,
        }),
        item('controller', 'Controller', Icons.Code, 'node-blue', 'Tar emot API-anrop och skickar dem till applikationslagret.'),
        item('middleware', 'Middleware', Icons.Layers, 'node-slate', 'Hanterar tvärgående HTTP-logik.'),
        item('dto', 'DTO', Icons.FileText, 'node-white-indigo', 'Data som skickas mellan API och klient.', { fields: [] }),
    ] },
    { category: 'Application & CQRS', items: [
        item('service', 'Service', Icons.Settings, 'node-indigo', 'Orkestrerar en tydlig affärsåtgärd.'),
        item('usecase', 'Use Case', Icons.Zap, 'node-amber', 'Ett användarfall med ett tydligt mål.'),
        item('command', 'Command', Icons.Download, 'node-orange', 'En begäran som ändrar data eller tillstånd.'),
        item('query', 'Query', Icons.Upload, 'node-teal', 'En begäran som läser data utan att ändra den.'),
        item('commandhandler', 'Command Handler', Icons.Cpu, 'node-orange', 'Utför en Command.'),
        item('queryhandler', 'Query Handler', Icons.Cpu, 'node-teal', 'Utför en Query.'),
        item('validator', 'Validator', Icons.Check, 'node-green', 'Kontrollerar att indata följer reglerna.'),
        item('mapper', 'Mapper', Icons.Move, 'node-sky', 'Översätter mellan modeller eller DTO:er.'),
    ] },
    { category: 'Domain Model', items: [
        item('classnode', 'Klass', Icons.Code, 'node-white-purple', 'En klass med egenskaper och metoder.', { properties: [], methods: [] }),
        item('interface', 'Interface', Icons.Code, 'node-white-pink', 'Ett kontrakt som implementationer följer.', { properties: [], methods: [] }),
        item('entity', 'Entity', Icons.Box, 'node-white-purple', 'Ett domänobjekt med stabil identitet.', { fields: [] }),
        item('record', 'Record', Icons.FileText, 'node-white-pink', 'Ett litet, oftast oföränderligt dataobjekt.', { fields: [] }),
        item('model', 'Model', Icons.Box, 'node-white-indigo', 'En data- eller presentationsmodell.', { fields: [] }),
        item('valueobject', 'Value Object', Icons.Layers, 'node-white-pink', 'Ett domänvärde utan egen identitet.'),
        item('aggregate', 'Aggregate', Icons.Box, 'node-amber', 'En konsekvensgräns för relaterade domänobjekt.'),
    ] },
    { category: 'Infrastructure & Messaging', items: [
        item('repository', 'Repository', Icons.Database, 'node-green', 'Läser och sparar domänobjekt.'),
        item('dbcontext', 'Database Context', Icons.Database, 'node-emerald', 'Databasanslutning och enhet för arbete.'),
        item('externalservice', 'Extern Tjänst', Icons.Cloud, 'node-sky', 'Ett system utanför din applikation.'),
        item('event', 'Event', Icons.Zap, 'node-yellow', 'Ett faktum om något som redan har hänt.'),
        item('messagebroker', 'Message Broker', Icons.Network, 'node-orange', 'Förmedlar asynkrona meddelanden mellan delar av systemet.'),
        item('consumer', 'Consumer', Icons.Cpu, 'node-indigo', 'Lyssnar på och hanterar ett meddelande eller event.'),
    ] },
    { category: 'Testing', items: [
        item('testproject', 'Test Project', Icons.Layers, 'node-slate', 'En samling automatiserade tester.'),
        item('unittest', 'Unit Test', Icons.Check, 'node-green', 'Testar en liten del isolerat.'),
        item('integrationtest', 'Integration Test', Icons.Network, 'node-sky', 'Testar flera delar tillsammans.'),
        item('e2etest', 'E2E Test', Icons.MonitorSmartphone, 'node-indigo', 'Testar ett användarflöde från start till mål.'),
        item('mockfake', 'Mock / Fake', Icons.Box, 'node-white-slate', 'En kontrollerad ersättning för ett beroende.'),
        item('testfixture', 'Test Fixture', Icons.Settings, 'node-slate', 'Delad testdata och testuppsättning.'),
        item('testdatabase', 'Test Database', Icons.Database, 'node-green', 'Tillfällig databas för integrationstester.'),
    ] },
    { category: 'Network & Storage', items: [
        item('loadbalancer', 'Load Balancer', Icons.Network, 'node-orange', 'Fördelar trafik mellan flera instanser.'),
        item('apigateway', 'API Gateway', Icons.Cloud, 'node-sky', 'En gemensam ingång till flera API:er.'),
        item('objectstore', 'Object Store', Icons.Box, 'node-amber', 'Lagrar filer och objekt.'),
    ] },
    { category: 'External', items: [
        item('client', 'Client App', Icons.MonitorSmartphone, 'node-slate', 'En webb-, mobil- eller desktopklient.'),
        item('users', 'Users', Icons.Users, 'node-slate', 'Människor eller andra aktörer som använder systemet.'),
    ] },
    { category: 'Generell', items: [
        item('custom', 'Egen Modul', Icons.Box, 'node-white-slate', 'En egen komponent eller modul.'),
        item('note', 'Anteckning', Icons.FileText, 'node-note'),
    ] },
    { category: 'Gruppering & Områden', items: [
        item('group', 'Grupp / Område', Icons.SquareDashed, 'node-group', '', { width: 350, height: 250 }),
    ] },
];

export function getNodeConfig(type) {
    for (const category of NODE_TYPES) {
        const match = category.items.find((definition) => definition.type === type);
        if (match) return match;
    }
    return item('custom', 'Egen Modul', Icons.Box, 'node-white-slate');
}
