import { validateSession } from "@/actions/validateSession";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const session = await validateSession();
    const response = await prisma.account.findUnique({
      where: {
        userId: session.user.id,
      },

      select: {
        notifications: {
          orderBy: {
            createdAt: "desc",
          },
          where: {
            isArchived: false,
          },
        },
      },
    });

    if (!response) {
      return NextResponse.json({
        msg: "Invalid request",
        success: false,
      });
    }

    return NextResponse.json({
      msg: "Notifications fetched",
      success: true,
      notifications: response.notifications,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Internal server error",
      success: false,
    });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const { notifications } = await req.json();
    if (notifications.length < 1) {
      return NextResponse.json({
        msg: "No notifications to update",
        success: false,
      });
    }
    await Promise.all(
      notifications.map(async (n: { id: string }) => {
        await prisma.notification.update({
          where: {
            id: n.id,
          },
          data: {
            isRead: true,
            readAt: new Date(),
          },
        });
      })
    );
    return NextResponse.json({
      msg: "Notifications updated",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Internal server error",
      success: false,
    });
  }
};
