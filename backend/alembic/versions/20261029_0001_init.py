"""Initialize skill templates.
Revision ID: 20261029_0001
Revises:
"""
from alembic import op
import sqlalchemy as sa
revision = "20261029_0001"
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.create_table("skill_templates",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
    )

def downgrade() -> None:
    op.drop_table("skill_templates")
