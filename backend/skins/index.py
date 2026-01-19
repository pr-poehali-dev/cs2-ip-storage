import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    """API для управления скинами CS2: получение списка, добавление, обновление и удаление"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
            rarity_filter = query_params.get('rarity')
            min_price = query_params.get('min_price')
            max_price = query_params.get('max_price')
            weapon_filter = query_params.get('weapon')
            
            query = '''
                SELECT s.*, 
                       ARRAY_AGG(ss.sticker_name) FILTER (WHERE ss.sticker_name IS NOT NULL) as stickers
                FROM skins s
                LEFT JOIN skin_stickers ss ON s.id = ss.skin_id
                WHERE s.is_available = true
            '''
            params = []
            
            if rarity_filter:
                query += ' AND s.rarity = %s'
                params.append(rarity_filter)
            
            if weapon_filter:
                query += ' AND s.weapon ILIKE %s'
                params.append(f'%{weapon_filter}%')
            
            if min_price:
                query += ' AND s.price >= %s'
                params.append(int(min_price))
            
            if max_price:
                query += ' AND s.price <= %s'
                params.append(int(max_price))
            
            query += ' GROUP BY s.id ORDER BY s.price DESC'
            
            cur.execute(query, params)
            skins = cur.fetchall()
            
            result = []
            for skin in skins:
                skin_dict = dict(skin)
                skin_dict['float_value'] = float(skin_dict['float_value'])
                result.append(skin_dict)
            
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
                INSERT INTO skins (name, weapon, rarity, wear, price, image_url, float_value, owner_name)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            ''', (
                body['name'],
                body['weapon'],
                body['rarity'],
                body['wear'],
                body['price'],
                body.get('image_url'),
                body['float_value'],
                body.get('owner_name', 'Admin')
            ))
            
            skin_id = cur.fetchone()['id']
            
            if 'stickers' in body and body['stickers']:
                for sticker in body['stickers']:
                    cur.execute('''
                        INSERT INTO skin_stickers (skin_id, sticker_name)
                        VALUES (%s, %s)
                    ''', (skin_id, sticker))
            
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'id': skin_id, 'message': 'Skin added successfully'}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            skin_id = body.get('id')
            
            if not skin_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Skin ID required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute('''
                UPDATE skins
                SET name = %s, weapon = %s, rarity = %s, wear = %s, 
                    price = %s, image_url = %s, float_value = %s, 
                    owner_name = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
            ''', (
                body['name'],
                body['weapon'],
                body['rarity'],
                body['wear'],
                body['price'],
                body.get('image_url'),
                body['float_value'],
                body.get('owner_name'),
                skin_id
            ))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': 'Skin updated successfully'}),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            query_params = event.get('queryStringParameters') or {}
            skin_id = query_params.get('id')
            
            if not skin_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Skin ID required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute('UPDATE skins SET is_available = false WHERE id = %s', (skin_id,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': 'Skin removed successfully'}),
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