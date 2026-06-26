import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { accentOn, borderOn, isDarkColor, mutedOn, textOn } from "../theme/themeEngine";
import { BookingDay, BookingModule, BookingSlot, MerchantConfig } from "../types/merchant";

type MerchantReservationModalProps = {
  visible: boolean;
  merchant: MerchantConfig;
  booking?: BookingModule;
  accentColor: string;
  secondaryColor: string;
  textColor: string;
  mutedTextColor: string;
  surfaceColor: string;
  onClose: () => void;
};

type HourRow = {
  id: string;
  hour: number;
  time: string;
  available: boolean;
  status: string;
  sourceSlot?: BookingSlot;
};

const calendarDays = [
  "28",
  "29",
  "30",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
  "1",
];

const dateNumber = (date: string) => date.split(" ")[0];

function buildHourRows(day: BookingDay, type: BookingModule["type"]): HourRow[] {
  const openHour = type === "barber" ? 9 : 8;
  const closeHour = type === "barber" ? 20 : 22;

  return Array.from({ length: 24 }, (_, hour) => {
    const sourceSlot = day.slots.find((slot) => Number(slot.time.slice(0, 2)) === hour);
    const workingHour = hour >= openHour && hour <= closeHour;
    const generatedAvailable = workingHour && hour % 4 !== 0;
    const available = sourceSlot ? sourceSlot.available : generatedAvailable;
    const hasFew = available && hour % 5 === 0;

    return {
      id: sourceSlot?.id ?? `${day.id}-hour-${hour}`,
      hour,
      time: sourceSlot?.time ?? `${String(hour).padStart(2, "0")}:00`,
      available,
      status: !workingHour ? "Poza godzinami" : available ? (hasFew ? "Mało miejsc" : "Wolny termin") : "Brak dostępności",
      sourceSlot,
    };
  });
}

function firstAvailableHour(day?: BookingDay, type?: BookingModule["type"]) {
  if (!day || !type) {
    return undefined;
  }
  return buildHourRows(day, type).find((row) => row.available);
}

export function MerchantReservationModal({
  visible,
  merchant,
  booking,
  accentColor,
  textColor,
  mutedTextColor,
  surfaceColor,
  onClose,
}: MerchantReservationModalProps) {
  const initialDay = booking?.days[0];
  const initialService = booking?.services[0];
  const [selectedDayId, setSelectedDayId] = React.useState(initialDay?.id);
  const [selectedSlotId, setSelectedSlotId] = React.useState<string | undefined>();
  const [selectedServiceId, setSelectedServiceId] = React.useState(initialService?.id);
  const [hasChosenDay, setHasChosenDay] = React.useState(false);
  const [showCalendar, setShowCalendar] = React.useState(true);

  React.useEffect(() => {
    setSelectedDayId(initialDay?.id);
    setSelectedSlotId(undefined);
    setSelectedServiceId(initialService?.id);
    setHasChosenDay(false);
    setShowCalendar(true);
  }, [initialDay?.id, initialService?.id, visible]);

  if (!booking?.enabled || !initialDay || !initialService) {
    return null;
  }

  const selectedDay = booking.days.find((day) => day.id === selectedDayId) ?? initialDay;
  const selectedService = booking.services.find((service) => service.id === selectedServiceId) ?? initialService;
  const hourRows = buildHourRows(selectedDay, booking.type);
  const availableHourRows = hourRows.filter((row) => row.available);
  const selectedHour = hourRows.find((row) => row.id === selectedSlotId);
  const backgroundText = textOn(merchant.backgroundColor) || textColor;
  const backgroundMuted = mutedOn(merchant.backgroundColor) || mutedTextColor;
  const surfaceText = textOn(surfaceColor) || textColor;
  const surfaceMuted = mutedOn(surfaceColor) || mutedTextColor;
  const surfaceAccent = accentOn(surfaceColor, accentColor);
  const backgroundAccent = accentOn(merchant.backgroundColor, accentColor);
  const surfaceBorder = borderOn(surfaceColor);
  const subtleSurface = isDarkColor(surfaceColor) ? "rgba(255,255,255,0.08)" : "rgba(17,24,39,0.05)";
  const selectedSurface = isDarkColor(surfaceColor) ? "rgba(255,255,255,0.12)" : "rgba(17,24,39,0.07)";
  const payFillColor = accentOn(surfaceColor, accentColor);
  const payTextColor = textOn(payFillColor);
  const payGradientColors: [string, string] = [payFillColor, payFillColor];

  const selectDay = (day: BookingDay) => {
    setSelectedDayId(day.id);
    setSelectedSlotId(undefined);
    setHasChosenDay(true);
    setShowCalendar(false);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <SafeAreaView style={[styles.safe, { backgroundColor: merchant.backgroundColor }]}>
        <View style={[styles.stickyHeader, { backgroundColor: merchant.backgroundColor, borderBottomColor: borderOn(merchant.backgroundColor) }]}>
          <Pressable onPress={onClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color={backgroundText} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={[styles.title, { color: backgroundText }]}>Rezerwacje</Text>
            <Text style={[styles.subtitle, { color: backgroundMuted }]}>Kalendarz i dostępne godziny</Text>
          </View>
          <View style={[styles.headerIcon, { borderColor: borderOn(merchant.backgroundColor), backgroundColor: subtleSurface }]}>
            <Ionicons name="calendar-clear-outline" size={22} color={backgroundAccent} />
          </View>
        </View>

        <View style={styles.content}>
          <View style={[styles.monthCard, { backgroundColor: surfaceColor, borderColor: surfaceBorder }]}>
            <View style={styles.bookingCardTop}>
              {!showCalendar ? (
                <Pressable
                  onPress={() => setShowCalendar(true)}
                  style={[styles.calendarBackButton, { borderColor: surfaceBorder, backgroundColor: subtleSurface }]}
                >
                  <Ionicons name="calendar-outline" size={18} color={surfaceAccent} />
                  <Text style={[styles.calendarBackText, { color: surfaceAccent }]}>Kalendarz</Text>
                </Pressable>
              ) : null}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                bounces={false}
                overScrollMode="never"
                contentContainerStyle={styles.dayRail}
              >
                {booking.days.map((day: BookingDay) => {
                  const active = hasChosenDay && day.id === selectedDay.id;
                  return (
                    <Pressable
                      key={day.id}
                      onPress={() => selectDay(day)}
                      style={[
                        styles.dayPill,
                        {
                          backgroundColor: active ? selectedSurface : "transparent",
                          borderColor: active ? surfaceAccent : surfaceBorder,
                        },
                      ]}
                    >
                      <Text style={[styles.dayLabel, { color: active ? surfaceAccent : surfaceMuted }]}>{day.label}</Text>
                      <Text style={[styles.dayDate, { color: active ? surfaceText : surfaceMuted }]}>{day.date}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {showCalendar ? (
              <>
                <View style={styles.monthHeader}>
                  <Text style={[styles.monthTitle, { color: surfaceText }]}>Czerwiec 2026</Text>
                  <View style={styles.monthArrows}>
                    <Ionicons name="chevron-back" size={22} color={surfaceMuted} />
                    <Ionicons name="chevron-forward" size={22} color={surfaceMuted} />
                  </View>
                </View>
                <View style={styles.weekHeader}>
                  {["PN", "WT", "ŚR", "CZW", "PT", "SOB", "NIEDZ"].map((label) => (
                    <Text key={label} style={[styles.weekHeaderText, { color: surfaceMuted }]}>
                      {label}
                    </Text>
                  ))}
                </View>
                <View style={styles.monthGrid}>
                  {calendarDays.map((day, index) => {
                    const matchingDay = booking.days.find((bookingDay) => dateNumber(bookingDay.date) === day);
                    const selected = hasChosenDay && matchingDay?.id === selectedDay.id;
                    const muted = index < 3 || index === calendarDays.length - 1;
                    const weekend = index % 7 === 5 || index % 7 === 6;
                    return (
                      <Pressable
                        key={`${day}-${index}`}
                        disabled={!matchingDay}
                        onPress={() => matchingDay && selectDay(matchingDay)}
                        style={styles.monthDay}
                      >
                        {selected ? (
                          <View style={[styles.selectedDate, { backgroundColor: accentColor }]}>
                            <Text style={[styles.selectedDateText, { color: textOn(accentColor) }]}>{day}</Text>
                          </View>
                        ) : (
                          <Text
                            style={[
                              styles.monthDayText,
                              {
                                color: matchingDay
                                  ? surfaceText
                                  : muted
                                    ? surfaceMuted
                                    : weekend
                                      ? "#E96363"
                                      : surfaceMuted,
                              },
                            ]}
                          >
                            {day}
                          </Text>
                        )}
                      </Pressable>
                    );
                  })}
                </View>
                <View style={styles.legend}>
                  <LegendDot color={surfaceAccent} label="Dostępne" textColor={surfaceMuted} />
                  <LegendDot color="#7BC7DE" label="Mało miejsc" textColor={surfaceMuted} />
                  <LegendDot color="#C5C8D2" label="Brak" textColor={surfaceMuted} />
                </View>
              </>
            ) : (
              <View style={styles.hoursPane}>
                <View style={styles.inlineHoursHeader}>
                  <View style={[styles.smallIcon, { backgroundColor: subtleSurface }]}>
                    <Ionicons name="time-outline" size={20} color={surfaceAccent} />
                  </View>
                  <View>
                    <Text style={[styles.inlineHoursTitle, { color: surfaceText }]}>Dostępne godziny</Text>
                    <Text style={[styles.sectionSubtitle, { color: surfaceMuted }]}>
                      {selectedDay.label}, {selectedDay.date}
                    </Text>
                  </View>
                </View>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                  decelerationRate="fast"
                  overScrollMode="never"
                  style={styles.hourList}
                  contentContainerStyle={styles.hourListContent}
                >
                  {availableHourRows.map((row: HourRow) => {
                    const active = row.id === selectedHour?.id;

                    return (
                      <Pressable
                        key={row.id}
                        onPress={() => setSelectedSlotId(row.id)}
                        style={[
                          styles.hourOption,
                          {
                            backgroundColor: active ? selectedSurface : subtleSurface,
                            borderColor: active ? surfaceAccent : surfaceBorder,
                          },
                        ]}
                      >
                        <View style={styles.hourOptionCopy}>
                          <Text style={[styles.hourOptionTime, { color: active ? surfaceAccent : surfaceText }]}>
                            {row.time}
                          </Text>
                          <Text style={[styles.hourOptionMeta, { color: surfaceMuted }]}>
                            {row.status} • {selectedService.name} • {selectedService.price}
                          </Text>
                        </View>
                        <View style={[styles.hourIndicator, { borderColor: active ? surfaceAccent : surfaceBorder }]}>
                          {active ? <View style={[styles.hourIndicatorDot, { backgroundColor: surfaceAccent }]} /> : null}
                        </View>
                      </Pressable>
                    );
                  })}
                </ScrollView>

              </View>
            )}
          </View>
        </View>

        <View style={[styles.footer, { backgroundColor: surfaceColor, borderTopColor: surfaceBorder }]}>
          <View style={styles.footerTop}>
            <View style={styles.footerCopy}>
              <Text style={[styles.footerTitle, { color: surfaceText }]} numberOfLines={1}>
                {hasChosenDay ? `${selectedDay.label}, ${selectedDay.date}` : "Wybierz dzień"}
              </Text>
              <Text style={[styles.footerMeta, { color: surfaceMuted }]} numberOfLines={1}>
                {selectedHour ? `${selectedHour.time} • ${selectedService.name} • ${selectedService.price}` : "Godzina i usługa pojawią się po wyborze terminu"}
              </Text>
            </View>
            <View style={[styles.footerTimeBadge, { backgroundColor: selectedHour ? selectedSurface : subtleSurface }]}>
              <Text style={[styles.footerTimeText, { color: selectedHour ? surfaceAccent : surfaceMuted }]}>
                {selectedHour?.time ?? "--:--"}
              </Text>
            </View>
          </View>

          <Pressable disabled={!selectedHour} style={[styles.payButton, !selectedHour && styles.payButtonDisabled]}>
            <LinearGradient colors={payGradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.payGradient}>
              <Text style={[styles.payText, { color: payTextColor }]}>Płacę</Text>
              <Ionicons name="logo-apple" size={20} color={payTextColor} />
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function LegendDot({ color, label, textColor }: { color: string; label: string; textColor: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={[styles.legendText, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  stickyHeader: {
    alignItems: "center",
    borderBottomColor: "rgba(120,120,120,0.08)",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 12,
    height: 106,
    left: 0,
    paddingHorizontal: 20,
    position: "absolute",
    right: 0,
    top: 18,
    zIndex: 10,
  },
  content: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 124,
  },
  backButton: {
    alignItems: "center",
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  headerCopy: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
  },
  headerIcon: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  bookingCardTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  dayRail: {
    gap: 8,
  },
  dayPill: {
    borderRadius: 16,
    borderWidth: 1,
    minWidth: 72,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: "900",
  },
  dayDate: {
    fontSize: 14,
    fontWeight: "900",
    marginTop: 4,
  },
  calendarBackButton: {
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    gap: 6,
    height: 50,
    paddingHorizontal: 12,
  },
  calendarBackText: {
    fontSize: 12,
    fontWeight: "900",
  },
  monthCard: {
    borderRadius: 0,
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 0,
  },
  monthHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: "900",
  },
  monthArrows: {
    flexDirection: "row",
    gap: 18,
  },
  weekHeader: {
    flexDirection: "row",
    marginBottom: 6,
  },
  weekHeaderText: {
    flex: 1,
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
  },
  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  monthDay: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    width: "14.2857%",
  },
  monthDayText: {
    fontSize: 16,
    fontWeight: "700",
  },
  selectedDate: {
    alignItems: "center",
    borderRadius: 19,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  selectedDateText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  legend: {
    borderColor: "rgba(120,120,120,0.12)",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 14,
    marginTop: 12,
    padding: 10,
  },
  legendItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: 7,
  },
  legendDot: {
    borderRadius: 6,
    height: 12,
    width: 12,
  },
  legendText: {
    color: "#666B78",
    fontSize: 11,
    fontWeight: "800",
  },
  hoursPane: {
    flex: 1,
    minHeight: 0,
  },
  inlineHoursHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  inlineHoursTitle: {
    fontSize: 18,
    fontWeight: "900",
  },
  smallIcon: {
    alignItems: "center",
    borderRadius: 16,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },
  hourList: {
    flex: 1,
    minHeight: 0,
  },
  hourListContent: {
    gap: 10,
    paddingBottom: 188,
  },
  hourOption: {
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 66,
    overflow: "hidden",
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  hourOptionCopy: {
    flex: 1,
    minWidth: 0,
  },
  hourOptionTime: {
    fontSize: 22,
    fontWeight: "900",
  },
  hourOptionMeta: {
    fontSize: 12,
    fontWeight: "800",
    marginTop: 4,
  },
  hourIndicator: {
    alignItems: "center",
    borderRadius: 11,
    borderWidth: 1,
    height: 22,
    justifyContent: "center",
    width: 22,
  },
  hourIndicatorDot: {
    borderRadius: 6,
    height: 12,
    width: 12,
  },
  footer: {
    borderTopWidth: 1,
    bottom: 0,
    left: 0,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
    position: "absolute",
    right: 0,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.08,
    shadowRadius: 22,
    zIndex: 20,
  },
  footerTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  footerCopy: {
    flex: 1,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: "900",
  },
  footerMeta: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
  },
  footerTimeBadge: {
    alignItems: "center",
    borderRadius: 14,
    height: 42,
    justifyContent: "center",
    minWidth: 66,
    paddingHorizontal: 10,
  },
  footerTimeText: {
    fontSize: 15,
    fontWeight: "900",
  },
  payButton: {
    borderRadius: 18,
    marginTop: 12,
    overflow: "hidden",
  },
  payButtonDisabled: {
    opacity: 0.42,
  },
  payGradient: {
    alignItems: "center",
    borderRadius: 18,
    flexDirection: "row",
    gap: 8,
    height: 54,
    justifyContent: "center",
  },
  payText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
});
