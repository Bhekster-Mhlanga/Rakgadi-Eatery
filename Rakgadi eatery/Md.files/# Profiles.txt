# Profiles

id
username
full_name
email
phone_number
profile_picture_url
role
created_at
updated_at

# Categories

id
name
description
created_at

# Products

id
category_id
name
description
price
image_url
available
featured
created_at

# Orders

id
order_number
customer_id
status
collection_pin
qr_token
subtotal
total_amount
estimated_collection_time
verification_method
collected_at
created_at

# Order_Items

id
order_id
product_id
quantity
unit_price
subtotal

# Notifications

id
user_id
title
message
is_read
created_at

# Promotions

id
title
description
discount_percentage
start_date
end_date
is_active

# Settings

id
business_name
phone_number
business_email
address
opening_time
closing_time
updated_at