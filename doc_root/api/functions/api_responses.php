<?php

require_once __DIR__ . "/response_codes.php";

function InternalError($error): never
{
    error_log($error);
    MessageResponse(HTTP_INTERNAL_ERROR);
    exit;
}
function MessageResponse($code, $detail = null, $msg = null): never
{
    $body = [
        'status' => $code,
        'message' => $msg ?? GetStatusMessage($code)
    ];
    if(isset($detail))
        $body['detail'] = $detail;
    DetailedResponse($code, $body);
    exit;
}

function DetailedResponse($code, $body): never
{
    header("Content-Type: application/json", true, $code);
    echo json_encode($body);
    global $conn;
    $conn->close();
    exit;
}