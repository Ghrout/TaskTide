<!DOCTYPE html>
<html>
<head>
    <title>Notificación de Actividad Alta</title>
</head>
<body>
    <h1>Notificación de Actividad Alta</h1>
    <p>Se ha creado una nueva actividad con alta prioridad.</p>
    <p><strong>Detalles de la Actividad:</strong></p>
    <ul>
        <li>Título: {{ $activity->title }}</li>
        <li>Descripción: {{ $activity->description }}</li>
        <li>Prioridad: {{ $activity->priority }}</li>
    </ul>
</body>
</html>
