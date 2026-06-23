import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BookingDay, BookingModule, BookingService, BookingSlot, MerchantConfig } from "../types/merchant";

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

const rowHeight = 64;

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
  secondaryColor,
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

  React.useEffect(() => {
    setSelectedDayId(initialDay?.id);
    setSelectedSlotId(undefined);
    setSelectedServiceId(initialService?.id);
    setHasChosenDay(false);
  }, [initialDay?.id, initialService?.id, visible]);

  if (!booking?.enabled || !initialDay || !initialService) {
    return null;
  }

  const selectedDay = booking.days.find((day) => day.id === selectedDayId) ?? initialDay;
  const selectedService = booking.services.find((service) => service.id === selectedServiceId) ?? initialService;
  const hourRows = buildHourRows(selectedDay, booking.type);
  const selectedHour = hourRows.find((row) => row.id === selectedSlotId);

  const selectDay = (day: BookingDay) => {
    setSelectedDayId(day.id);
    setSelectedSlotId(undefined);
    setHasChosenDay(true);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <SafeAreaView style={[styles.safe, { backgroundColor: merchant.backgroundColor }]}>
        <View style={[styles.stickyHeader, { backgroundColor: merchant.backgroundColor }]}>
          <Pressable onPress={onClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color={textColor} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={[styles.title, { color: textColor }]}>Rezerwacje</Text>
            <Text style={[styles.subtitle, { color: mutedTextColor }]}>Kalendarz i dostępne godziny</Text>
          </View>
          <View style={[styles.headerIcon, { borderColor: `${accentColor}33`, backgroundColor: `${accentColor}12` }]}>
            <Ionicons name="calendar-clear-outline" size={22} color={accentColor} />
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces
          alwaysBounceVertical
          decelerationRate="normal"
          overScrollMode="never"
          contentContainerStyle={styles.content}
        >
          <View style={[styles.dayRailCard, { backgroundColor: surfaceColor }]}>
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
                        backgroundColor: active ? `${accentColor}18` : "transparent",
                        borderColor: active ? `${accentColor}44` : "rgba(120,120,120,0.14)",
                      },
                    ]}
                  >
                    <Text style={[styles.dayLabel, { color: active ? accentColor : mutedTextColor }]}>{day.label}</Text>
                    <Text style={[styles.dayDate, { color: active ? textColor : mutedTextColor }]}>{day.date}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View style={[styles.monthCard, { backgroundColor: surfaceColor }]}>
            <View style={styles.monthHeader}>
              <Text style={[styles.monthTitle, { color: textColor }]}>Czerwiec 2026</Text>
              <View style={styles.monthArrows}>
                <Ionicons name="chevron-back" size={22} color={mutedTextColor} />
                <Ionicons name="chevron-forward" size={22} color={mutedTextColor} />
              </View>
            </View>
            <View style={styles.weekHeader}>
              {["PN", "WT", "ŚR", "CZW", "PT", "SOB", "NIEDZ"].map((label) => (
                <Text key={label} style={[styles.weekHeaderText, { color: mutedTextColor }]}>
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
                        <Text style={styles.selectedDateText}>{day}</Text>
                      </View>
                    ) : (
                      <Text
                        style={[
                          styles.monthDayText,
                          {
                            color: matchingDay
                              ? textColor
                              : muted
                                ? "#B9BDC7"
                                : weekend
                                  ? "#E96363"
                                  : mutedTextColor,
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
              <LegendDot color={accentColor} label="Dostępne" />
              <LegendDot color="#7BC7DE" label="Mało miejsc" />
              <LegendDot color="#C5C8D2" label="Brak" />
            </View>
          </View>

          {hasChosenDay ? (
            <View style={[styles.hoursCard, { backgroundColor: surfaceColor }]}>
              <View style={styles.sectionTitleRow}>
                <View style={[styles.smallIcon, { backgroundColor: `${accentColor}12` }]}>
                  <Ionicons name="time-outline" size={20} color={accentColor} />
                </View>
                <View>
                  <Text style={[styles.sectionTitle, { color: textColor }]}>Godziny</Text>
                  <Text style={[styles.sectionSubtitle, { color: mutedTextColor }]}>Karuzela 24h</Text>
                </View>
              </View>
              <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={false}
                decelerationRate="fast"
                snapToInterval={rowHeight + 10}
                snapToAlignment="start"
                overScrollMode="never"
                style={styles.hourCarousel}
                contentContainerStyle={styles.hourCarouselContent}
              >
                {hourRows.map((row: HourRow) => {
                  const active = row.id === selectedHour?.id;
                  return (
                    <Pressable
                      key={row.id}
                      disabled={!row.available}
                      onPress={() => setSelectedSlotId(row.id)}
                      style={[
                        styles.hourRow,
                        {
                          borderColor: active ? `${accentColor}55` : "rgba(120,120,120,0.12)",
                          backgroundColor: active ? `${accentColor}12` : row.available ? "rgba(255,255,255,0.74)" : "rgba(120,120,120,0.06)",
                          opacity: row.available ? 1 : 0.56,
                        },
                      ]}
                    >
                      <Text style={[styles.hourTime, { color: active ? accentColor : textColor }]}>{row.time}</Text>
                      <View style={styles.hourMeta}>
                        <Text style={[styles.hourStatus, { color: row.available ? textColor : mutedTextColor }]}>
                          {row.status}
                        </Text>
                        <Text style={[styles.hourService, { color: mutedTextColor }]}>
                          {row.available ? "Dotknij, aby wybrać" : selectedService.name}
                        </Text>
                      </View>
                      <View style={[styles.hourIndicator, { borderColor: active ? accentColor : "rgba(120,120,120,0.22)" }]}>
                        {active && <View style={[styles.hourIndicatorDot, { backgroundColor: accentColor }]} />}
                      </View>
                      {!row.available && <View style={styles.unavailableLine} />}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          ) : (
            <View style={[styles.emptyHoursCard, { backgroundColor: surfaceColor }]}>
              <View style={[styles.smallIcon, { backgroundColor: `${accentColor}12` }]}>
                <Ionicons name="calendar-number-outline" size={20} color={accentColor} />
              </View>
              <View style={styles.emptyCopy}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>Wybierz dzień</Text>
                <Text style={[styles.sectionSubtitle, { color: mutedTextColor }]}>
                  Po wyborze dnia pokażemy karuzelę godzin.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: surfaceColor, borderTopColor: "rgba(120,120,120,0.12)" }]}>
          <View style={styles.footerTop}>
            <View style={styles.footerCopy}>
              <Text style={[styles.footerTitle, { color: textColor }]} numberOfLines={1}>
                {hasChosenDay ? `${selectedDay.label}, ${selectedDay.date}` : "Wybierz dzień"}
              </Text>
              <Text style={[styles.footerMeta, { color: mutedTextColor }]} numberOfLines={1}>
                {selectedHour ? `${selectedHour.time} • ${selectedService.name} • ${selectedService.price}` : "Godzina i usługa pojawią się po wyborze terminu"}
              </Text>
            </View>
            <View style={[styles.footerTimeBadge, { backgroundColor: selectedHour ? `${accentColor}14` : "rgba(120,120,120,0.08)" }]}>
              <Text style={[styles.footerTimeText, { color: selectedHour ? accentColor : mutedTextColor }]}>
                {selectedHour?.time ?? "--:--"}
              </Text>
            </View>
          </View>

          {selectedHour && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              bounces={false}
              overScrollMode="never"
              contentContainerStyle={styles.serviceRail}
            >
              {booking.services.map((service: BookingService) => {
                const active = service.id === selectedService.id;
                return (
                  <Pressable
                    key={service.id}
                    onPress={() => setSelectedServiceId(service.id)}
                    style={[
                      styles.serviceChip,
                      {
                        backgroundColor: active ? `${accentColor}14` : "rgba(120,120,120,0.06)",
                        borderColor: active ? `${accentColor}44` : "rgba(120,120,120,0.12)",
                      },
                    ]}
                  >
                    <Text style={[styles.serviceChipTitle, { color: active ? accentColor : textColor }]}>{service.name}</Text>
                    <Text style={[styles.serviceChipMeta, { color: mutedTextColor }]}>
                      {service.duration} • {service.price}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          <Pressable disabled={!selectedHour} style={[styles.payButton, !selectedHour && styles.payButtonDisabled]}>
            <LinearGradient colors={[accentColor, secondaryColor]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.payGradient}>
              <Text style={styles.payText}>Płacę</Text>
              <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
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
    paddingBottom: 196,
    paddingHorizontal: 20,
    paddingTop: 142,
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
  dayRailCard: {
    borderRadius: 20,
    marginBottom: 14,
    padding: 8,
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
  monthCard: {
    borderRadius: 22,
    marginBottom: 14,
    padding: 16,
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
  hoursCard: {
    borderRadius: 22,
    marginBottom: 14,
    padding: 16,
  },
  emptyHoursCard: {
    alignItems: "center",
    borderRadius: 22,
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
    padding: 16,
  },
  emptyCopy: {
    flex: 1,
  },
  sectionTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
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
  hourCarousel: {
    height: rowHeight * 4 + 30,
  },
  hourCarouselContent: {
    gap: 10,
    paddingBottom: 8,
  },
  hourRow: {
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    height: rowHeight,
    overflow: "hidden",
    paddingHorizontal: 14,
  },
  hourTime: {
    fontSize: 20,
    fontWeight: "900",
    width: 74,
  },
  hourMeta: {
    flex: 1,
  },
  hourStatus: {
    fontSize: 14,
    fontWeight: "900",
  },
  hourService: {
    fontSize: 12,
    fontWeight: "700",
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
  unavailableLine: {
    backgroundColor: "rgba(120,120,120,0.18)",
    height: 1,
    position: "absolute",
    right: 14,
    transform: [{ rotate: "-15deg" }],
    width: 108,
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
  serviceRail: {
    gap: 8,
    paddingTop: 12,
  },
  serviceChip: {
    borderRadius: 14,
    borderWidth: 1,
    minWidth: 136,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  serviceChipTitle: {
    fontSize: 13,
    fontWeight: "900",
  },
  serviceChipMeta: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
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
