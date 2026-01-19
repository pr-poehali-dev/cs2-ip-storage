import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    """API для обмена скинами: создание, просмотр и принятие предложений обмена"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    
    try:
        conn = psycopg2.connect(dsn)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            query_params = event.get('queryStringParameters') or {}
            user = query_params.get('user')
            status_filter = query_params.get('status', 'pending')
            
            if user:
                cur.execute('''
                    SELECT t.*,
                           os.name as offered_skin_name,
                           os.weapon as offered_weapon,
                           os.image_url as offered_image,
                           os.price as offered_price,
                           rs.name as requested_skin_name,
                           rs.weapon as requested_weapon,
                           rs.image_url as requested_image,
                           rs.price as requested_price
                    FROM trade_offers t
                    JOIN skins os ON t.offered_skin_id = os.id
                    JOIN skins rs ON t.requested_skin_id = rs.id
                    WHERE (t.from_user = %s OR t.to_user = %s)
                      AND t.status = %s
                    ORDER BY t.created_at DESC
                ''', (user, user, status_filter))
            else:
                cur.execute('''
                    SELECT t.*,
                           os.name as offered_skin_name,
                           os.weapon as offered_weapon,
                           os.image_url as offered_image,
                           os.price as offered_price,
                           rs.name as requested_skin_name,
                           rs.weapon as requested_weapon,
                           rs.image_url as requested_image,
                           rs.price as requested_price
                    FROM trade_offers t
                    JOIN skins os ON t.offered_skin_id = os.id
                    JOIN skins rs ON t.requested_skin_id = rs.id
                    WHERE t.status = %s
                    ORDER BY t.created_at DESC
                    LIMIT 50
                ''', (status_filter,))
            
            trades = cur.fetchall()
            result = [dict(trade) for trade in trades]
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(result, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            cur.execute('''
                INSERT INTO trade_offers (from_user, to_user, offered_skin_id, requested_skin_id, message)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
            ''', (
                body['from_user'],
                body['to_user'],
                body['offered_skin_id'],
                body['requested_skin_id'],
                body.get('message', '')
            ))
            
            trade_id = cur.fetchone()['id']
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'id': trade_id, 'message': 'Trade offer created'}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            trade_id = body.get('id')
            new_status = body.get('status')
            
            if not trade_id or not new_status:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Trade ID and status required'}),
                    'isBase64Encoded': False
                }
            
            if new_status == 'accepted':
                cur.execute('SELECT * FROM trade_offers WHERE id = %s', (trade_id,))
                trade = cur.fetchone()
                
                if trade:
                    cur.execute('''
                        UPDATE skins 
                        SET owner_name = %s 
                        WHERE id = %s
                    ''', (trade['to_user'], trade['offered_skin_id']))
                    
                    cur.execute('''
                        UPDATE skins 
                        SET owner_name = %s 
                        WHERE id = %s
                    ''', (trade['from_user'], trade['requested_skin_id']))
            
            cur.execute('''
                UPDATE trade_offers
                SET status = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
            ''', (new_status, trade_id))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': f'Trade {new_status}'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
