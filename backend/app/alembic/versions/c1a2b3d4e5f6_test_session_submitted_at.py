"""test session: add submitted_at (locks a test once submitted)

Revision ID: c1a2b3d4e5f6
Revises: abf160860221
Create Date: 2026-07-27 11:10:00.000000

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "c1a2b3d4e5f6"
down_revision = "abf160860221"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "usertestsession",
        sa.Column("submitted_at", sa.DateTime(timezone=True), nullable=True),
    )


def downgrade():
    op.drop_column("usertestsession", "submitted_at")
